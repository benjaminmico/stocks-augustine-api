const AWS = require('aws-sdk');
import createSupplier from './createSupplier';
import { SupplierInput, SaleFormat, UnitOfMeasure } from 'types/graphql-types';

const dynamoDB = new AWS.DynamoDB({
  region: 'local',
  endpoint: 'http://localhost:8000',
});

const testTableName = 'SUPPLIER_TABLE';
process.env.AWS_ENV = 'LOCAL';
process.env.SUPPLIER_TABLE = testTableName;

describe('createSupplier Integration Test', () => {
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
    console.log(`Table ${testTableName} has been created.`);
  }, 30000);

  afterAll(async () => {
    await dynamoDB.deleteTable({ TableName: testTableName }).promise();
    await dynamoDB
      .waitFor('tableNotExists', { TableName: testTableName })
      .promise();
  });

  it('should create a supplier in DynamoDB', async () => {
    const supplierInput: SupplierInput = {
      name: 'Test Supplier',
    };

    const result = await createSupplier(supplierInput);

    expect(result).toHaveProperty('supplierId');
    expect(result).toHaveProperty('name', supplierInput.name);

    const response = await dynamoDB
      .getItem({
        TableName: testTableName,
        Key: {
          supplierId: { S: result?.supplierId },
        },
      })
      .promise();

    // Assuming all fields are stored as strings in DynamoDB
    const transformedResponse = {
      supplierId: response.Item.supplierId.S,
      name: response.Item.name.S,
    };

    expect(transformedResponse).toEqual(
      expect.objectContaining({
        supplierId: result?.supplierId,
        ...supplierInput,
      }),
    );
  });
});
