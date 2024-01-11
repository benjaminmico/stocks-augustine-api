const AWS = require('aws-sdk');
import getSuppliers from './getSuppliers';

const dynamoDB = new AWS.DynamoDB({
  region: 'local',
  endpoint: 'http://localhost:8000',
});

const docClient = new AWS.DynamoDB.DocumentClient({
  region: 'local',
  endpoint: 'http://localhost:8000',
});

const testTableName = 'SUPPLIER_TABLE';
process.env.AWS_ENV = 'LOCAL';
process.env.SUPPLIER_TABLE = testTableName;

describe('getSuppliers Integration Test', () => {
  beforeAll(async () => {
    await dynamoDB
      .createTable({
        TableName: testTableName,
        KeySchema: [{ AttributeName: 'supplierId', KeyType: 'HASH' }],
        AttributeDefinitions: [
          { AttributeName: 'supplierId', AttributeType: 'S' },
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

    const testSuppliers = [
      {
        supplierId: 'supplier-1',
        name: 'Supplier 1',
      },
      {
        supplierId: 'supplier-2',
        name: 'Supplier 2',
      },
    ];

    for (const supplier of testSuppliers) {
      await docClient
        .put({
          TableName: testTableName,
          Item: supplier,
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

  it('should retrieve suppliers from DynamoDB', async () => {
    const result = await getSuppliers(null, null, 10, null);

    expect(result?.length).toBeGreaterThanOrEqual(2);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          supplierId: 'supplier-1',
          name: 'Supplier 1',
        }),
        expect.objectContaining({
          supplierId: 'supplier-2',
          name: 'Supplier 2',
        }),
      ]),
    );
  });
});
