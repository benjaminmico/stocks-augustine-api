const AWS = require('aws-sdk');
import createProduct from '../createProduct/createProduct';
import deleteProduct from './deleteProduct';
import { ProductInput, SaleFormat, UnitOfMeasure } from 'types/graphql-types';

const dynamoDB = new AWS.DynamoDB({
  region: 'local',
  endpoint: 'http://localhost:8000',
});

const testTableName = 'PRODUCT_TABLE';
process.env.AWS_ENV = 'LOCAL';
process.env.PRODUCT_TABLE = testTableName;

describe('deleteProduct Integration Test', () => {
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

  it('should delete a product from DynamoDB', async () => {
    // Create a product to delete
    const createInput: ProductInput = {
      name: 'Test Product',
      unit: 100,
      saleFormat: SaleFormat.Individual,
      price: 10.99,
      unitOfMeasure: UnitOfMeasure.Unit,
      supplierId: 'supplier123',
    };
    const createdProduct = await createProduct(createInput);

    // Ensure the product was created
    expect(createdProduct).not.toBeNull();
    expect(createdProduct).toHaveProperty('productId');

    if (!createdProduct)
      throw new Error('Product should exist before deletion');

    // Delete the product
    await deleteProduct(createdProduct.productId);

    // Try to fetch the deleted product from DynamoDB
    const response = await dynamoDB
      .getItem({
        TableName: testTableName,
        Key: { productId: { S: createdProduct.productId } },
      })
      .promise();

    // Verify the product is no longer in DynamoDB
    expect(response.Item).toBeUndefined();
  });
});
