import { DynamoDB } from 'aws-sdk';
import createProduct from './createProduct';
import { ProductInput, SaleFormat, UnitOfMeasure } from 'types/graphql-types';
import { v4 as uuid } from 'uuid';

const dynamoDB = new DynamoDB({
  region: 'local',
  endpoint: 'http://localhost:8000',
});

const docClient = new DynamoDB.DocumentClient({
  region: 'local',
  endpoint: 'http://localhost:8000',
});

const testProductTableName = 'TestProductTable';
const testRestaurantTableName = 'TestRestaurantTable';

process.env.PRODUCT_TABLE = testProductTableName;
process.env.RESTAURANT_TABLE = testRestaurantTableName;
process.env.AWS_ENV = 'LOCAL';

describe('createProduct Integration Test', () => {
  beforeAll(async () => {
    await Promise.all([
      dynamoDB
        .createTable({
          TableName: testProductTableName,
          KeySchema: [{ AttributeName: 'productId', KeyType: 'HASH' }],
          AttributeDefinitions: [
            { AttributeName: 'productId', AttributeType: 'S' },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        })
        .promise(),
      dynamoDB
        .createTable({
          TableName: testRestaurantTableName,
          KeySchema: [{ AttributeName: 'restaurantId', KeyType: 'HASH' }],
          AttributeDefinitions: [
            { AttributeName: 'restaurantId', AttributeType: 'S' },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        })
        .promise(),
    ]);

    await Promise.all([
      dynamoDB
        .waitFor('tableExists', { TableName: testProductTableName })
        .promise(),
      dynamoDB
        .waitFor('tableExists', { TableName: testRestaurantTableName })
        .promise(),
    ]);

    console.log(
      `Tables ${testProductTableName} and ${testRestaurantTableName} have been created.`,
    );
  }, 60000);

  afterAll(async () => {
    await Promise.all([
      dynamoDB.deleteTable({ TableName: testProductTableName }).promise(),
      dynamoDB.deleteTable({ TableName: testRestaurantTableName }).promise(),
    ]);

    await Promise.all([
      dynamoDB
        .waitFor('tableNotExists', { TableName: testProductTableName })
        .promise(),
      dynamoDB
        .waitFor('tableNotExists', { TableName: testRestaurantTableName })
        .promise(),
    ]);
  });

  it('should create a product in DynamoDB', async () => {
    const testRestaurantId = uuid();
    await docClient
      .put({
        TableName: testRestaurantTableName,
        Item: {
          restaurantId: testRestaurantId,
          name: 'test',
        },
      })
      .promise();

    const productInput: ProductInput = {
      name: 'Test Product',
      unit: 100,
      saleFormat: SaleFormat.Individual,
      price: 10.99,
      unitOfMeasure: UnitOfMeasure.Unit,
      supplierId: 'supplier123',
      restaurantId: testRestaurantId,
    };

    const result = await createProduct(productInput);

    expect(result).toHaveProperty('productId');
    expect(result).toHaveProperty('name', productInput.name);

    const response = await docClient
      .get({
        TableName: testProductTableName,
        Key: {
          productId: result?.productId,
        },
      })
      .promise();

    const transformedResponse = {
      productId: response?.Item?.productId,
      name: response?.Item?.name,
      price: response?.Item?.price,
      restaurantId: response?.Item?.restaurantId,
      saleFormat: response?.Item?.saleFormat,
      supplierId: response?.Item?.supplierId,
      unit: response?.Item?.unit,
      unitOfMeasure: response?.Item?.unitOfMeasure,
    };

    expect(transformedResponse).toEqual(
      expect.objectContaining({
        productId: result?.productId,
        ...productInput,
      }),
    );
  });

  it('should not create a product if the restaurant does not exist in DynamoDB', async () => {
    const nonExistentRestaurantId = uuid(); // Generate a random ID that doesn't exist in the table

    const productInput: ProductInput = {
      name: 'Test Product',
      unit: 100,
      saleFormat: SaleFormat.Individual,
      price: 10.99,
      unitOfMeasure: UnitOfMeasure.Unit,
      supplierId: 'supplier123',
      restaurantId: nonExistentRestaurantId, // Using the non-existent restaurant ID
    };

    const result = await createProduct(productInput);

    expect(result).toBeNull(); // Expecting null or a similar response indicating failure to create product

    // Additionally, check if the product was not created in the database
    const response = await docClient
      .get({
        TableName: testProductTableName,
        Key: {
          productId: nonExistentRestaurantId,
        },
      })
      .promise();

    expect(response.Item).toBeUndefined(); // Expecting no item to be returned
  });
});
