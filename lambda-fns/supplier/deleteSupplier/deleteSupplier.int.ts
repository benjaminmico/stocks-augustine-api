const AWS = require('aws-sdk');
import createSupplier from '../createSupplier/createSupplier';
import deleteSupplier from './deleteSupplier';
import { SupplierInput, SaleFormat, UnitOfMeasure } from 'types/graphql-types';

const dynamoDB = new AWS.DynamoDB({
  region: 'local',
  endpoint: 'http://localhost:8000',
});

const testTableName = 'SUPPLIER_TABLE';
process.env.AWS_ENV = 'LOCAL';
process.env.SUPPLIER_TABLE = testTableName;

describe('deleteSupplier Integration Test', () => {
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

  it('should delete a supplier from DynamoDB', async () => {
    // Create a supplier to delete
    const createInput: SupplierInput = {
      name: 'Test Supplier',
    };
    const createdSupplier = await createSupplier(createInput);

    // Ensure the supplier was created
    expect(createdSupplier).not.toBeNull();
    expect(createdSupplier).toHaveProperty('supplierId');

    if (!createdSupplier)
      throw new Error('Supplier should exist before deletion');

    // Delete the supplier
    await deleteSupplier(createdSupplier.supplierId);

    // Try to fetch the deleted supplier from DynamoDB
    const response = await dynamoDB
      .getItem({
        TableName: testTableName,
        Key: { supplierId: { S: createdSupplier.supplierId } },
      })
      .promise();

    // Verify the supplier is no longer in DynamoDB
    expect(response.Item).toBeUndefined();
  });
});
