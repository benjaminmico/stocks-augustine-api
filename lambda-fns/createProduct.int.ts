const AWS = require('aws-sdk');
import createProduct from './createProduct';
import { ProductInput, SaleFormat, UnitOfMeasure } from 'types/graphql-types';

const dynamoDB = new AWS.DynamoDB({
  region: 'local',
  endpoint: 'http://localhost:8000',
});

const testTableName = 'PRODUCT_TABLE';
process.env.AWS_ENV = 'LOCAL';
process.env.PRODUCT_TABLE = testTableName;

describe('createProduct Integration Test', () => {
  beforeAll(async () => {
    await dynamoDB
      .createTable({
        TableName: testTableName,
        KeySchema: [{ AttributeName: 'productId', KeyType: 'HASH' }],
        AttributeDefinitions: [
          { AttributeName: 'productId', AttributeType: 'S' },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      })
      .promise();

    await dynamoDB
      .waitFor('tableExists', { TableName: testTableName })
      .promise();
    console.log(`Table ${testTableName} has been created.`);
  }, 30000);

  afterAll(async () => {
    await dynamoDB.deleteTable({ TableName: testTableName }).promise();
    await dynamoDB
      .waitFor('tableNotExists', { TableName: testTableName })
      .promise();
  });

  it('should create a product in DynamoDB', async () => {
    const productInput: ProductInput = {
      name: 'Test Product',
      unit: 100,
      saleFormat: SaleFormat.Individual,
      price: 10.99,
      unitOfMeasure: UnitOfMeasure.Unit,
      supplierId: 'supplier123',
    };

    const result = await createProduct(productInput);

    expect(result).toHaveProperty('productId');
    expect(result).toHaveProperty('name', productInput.name);

    const response = await dynamoDB
      .getItem({
        TableName: testTableName,
        Key: {
          productId: { S: result?.productId },
        },
      })
      .promise();

    // Assuming all fields are stored as strings in DynamoDB
    const transformedResponse = {
      productId: response.Item.productId.S,
      name: response.Item.name.S,
      price: parseFloat(response.Item.price.N),
      saleFormat: response.Item.saleFormat.S,
      unit: parseFloat(response.Item.unit.N),
      unitOfMeasure: response.Item.unitOfMeasure.S,
      supplierId: response.Item.supplierId ? response.Item.supplierId.S : null,
    };

    expect(transformedResponse).toEqual(
      expect.objectContaining({
        productId: result?.productId,
        ...productInput,
      }),
    );
  });
});
