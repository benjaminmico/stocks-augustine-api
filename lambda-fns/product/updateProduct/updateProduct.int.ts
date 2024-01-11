const AWS = require('aws-sdk');
import createProduct from '../createProduct/createProduct';
import updateProduct from './updateProduct';
import {
  ProductInput,
  UpdateProductInput,
  SaleFormat,
  UnitOfMeasure,
} from 'types/graphql-types';

const dynamoDB = new AWS.DynamoDB({
  region: 'local',
  endpoint: 'http://localhost:8000',
});

const testTableName = 'PRODUCT_TABLE';
process.env.AWS_ENV = 'LOCAL';
process.env.PRODUCT_TABLE = testTableName;

describe('updateProduct Integration Test', () => {
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

  it('should update a product in DynamoDB', async () => {
    // Create a product to update
    const createInput: ProductInput = {
      name: 'Initial Product',
      unit: 100,
      saleFormat: SaleFormat.Individual,
      price: 10.99,
      unitOfMeasure: UnitOfMeasure.Unit,
      supplierId: 'supplier123',
    };
    const createdProduct = await createProduct(createInput);

    // Ensure the product was created before attempting to update it
    expect(createdProduct).not.toBeNull();
    expect(createdProduct).toHaveProperty('productId');

    if (!createdProduct) throw new Error('product should exists');

    // Define the update input
    const updateInput: UpdateProductInput = {
      productId: createdProduct.productId,
      name: 'Updated Test Product',
      unit: 200,
      saleFormat: SaleFormat.Package,
      price: 29.99,
      unitOfMeasure: UnitOfMeasure.Liter,
      supplierId: 'supplier456',
    };

    // Update the product
    const updateResult = await updateProduct(updateInput);

    // Verify the update result
    expect(updateResult).toHaveProperty('productId', updateInput.productId);
    expect(updateResult).toHaveProperty('name', updateInput.name);

    // Fetch the updated product from DynamoDB
    const response = await dynamoDB
      .getItem({
        TableName: testTableName,
        Key: { productId: { S: updateInput.productId } },
      })
      .promise();

    // Verify the product in DynamoDB is updated
    expect(response.Item).not.toBeNull();
    expect(response.Item.name.S).toEqual(updateInput.name);
    // ... other assertions based on updated fields
  });
});
