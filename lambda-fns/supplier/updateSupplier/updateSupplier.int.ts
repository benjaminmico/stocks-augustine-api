const AWS = require('aws-sdk');
import createSupplier from '../createSupplier/createSupplier';
import updateSupplier from './updateSupplier';
import { UpdateSupplierInput, Supplier } from 'types/graphql-types';

const dynamoDB = new AWS.DynamoDB({
  region: 'local',
  endpoint: 'http://localhost:8000',
});

const testTableName = 'SUPPLIER_TABLE';
process.env.AWS_ENV = 'LOCAL';
process.env.SUPPLIER_TABLE = testTableName;

describe('updateSupplier Integration Test', () => {
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

  it('should update a supplier in DynamoDB', async () => {
    // Create a supplier to update
    const createInput: Supplier = {
      name: 'Initial Supplier',
      supplierId: 'supplier123',
      restaurantId: 'restaurant123',
    };
    const createdSupplier = await createSupplier(createInput);

    // Ensure the supplier was created before attempting to update it
    expect(createdSupplier).not.toBeNull();
    expect(createdSupplier).toHaveProperty('supplierId');

    if (!createdSupplier) throw new Error('supplier should exists');

    // Define the update input
    const updateInput: UpdateSupplierInput = {
      supplierId: createdSupplier.supplierId,
      name: 'Updated Test Supplier',
    };

    // Update the supplier
    const updateResult = await updateSupplier(updateInput);

    // Verify the update result
    expect(updateResult).toHaveProperty('supplierId', updateInput.supplierId);
    expect(updateResult).toHaveProperty('name', updateInput.name);

    // Fetch the updated supplier from DynamoDB
    const response = await dynamoDB
      .getItem({
        TableName: testTableName,
        Key: { supplierId: { S: updateInput.supplierId } },
      })
      .promise();

    // Verify the supplier in DynamoDB is updated
    expect(response.Item).not.toBeNull();
    expect(response.Item.name.S).toEqual(updateInput.name);
    // ... other assertions based on updated fields
  });
});
