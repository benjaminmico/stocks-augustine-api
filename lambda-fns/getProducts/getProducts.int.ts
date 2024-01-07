const AWS = require('aws-sdk');
import getProducts from './getProducts';
import { ProductInput, SaleFormat, UnitOfMeasure } from 'types/graphql-types';

const dynamoDB = new AWS.DynamoDB({
  region: 'local',
  endpoint: 'http://localhost:8000',
});

const docClient = new AWS.DynamoDB.DocumentClient({
  region: 'local',
  endpoint: 'http://localhost:8000',
});

const testTableName = 'PRODUCT_TABLE';
process.env.AWS_ENV = 'LOCAL';
process.env.PRODUCT_TABLE = testTableName;

describe('getProducts Integration Test', () => {
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

    const testProducts = [
      {
        productId: 'prod-1',
        name: 'Product 1',
        unit: 10,
        saleFormat: SaleFormat.Individual,
        price: 19.99,
        unitOfMeasure: UnitOfMeasure.Unit,
        supplierId: 'supplier123',
      },
      {
        productId: 'prod-2',
        name: 'Product 2',
        unit: 5,
        saleFormat: SaleFormat.Package,
        price: 29.99,
        unitOfMeasure: UnitOfMeasure.Kilogram,
        supplierId: 'supplier456',
      },
    ];

    for (const product of testProducts) {
      await docClient
        .put({
          TableName: testTableName,
          Item: product,
        })
        .promise();
    }
  }, 30000);

  afterAll(async () => {
    await dynamoDB.deleteTable({ TableName: testTableName }).promise();
    await dynamoDB
      .waitFor('tableNotExists', { TableName: testTableName })
      .promise();
  });

  it('should retrieve products from DynamoDB', async () => {
    const result = await getProducts(null, null, 10, null);

    expect(result?.items.length).toBeGreaterThanOrEqual(2);
    expect(result?.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ productId: 'prod-1', name: 'Product 1' }),
        expect.objectContaining({ productId: 'prod-2', name: 'Product 2' }),
      ]),
    );
  });
});
