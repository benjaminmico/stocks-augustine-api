const AWS = require('aws-sdk');
import createRestaurant from '../createRestaurant/createRestaurant';
import deleteRestaurant from './deleteRestaurant';
import { RestaurantInput } from 'types/graphql-types';

const dynamoDB = new AWS.DynamoDB({
  region: 'local',
  endpoint: 'http://localhost:8000',
});

const testTableName = 'RESTAURANT_TABLE';
process.env.AWS_ENV = 'LOCAL';
process.env.RESTAURANT_TABLE = testTableName;

describe('deleteRestaurant Integration Test', () => {
  beforeAll(async () => {
    await dynamoDB
      .createTable({
        TableName: testTableName,
        KeySchema: [{ AttributeName: 'restaurantId', KeyType: 'HASH' }],
        AttributeDefinitions: [
          { AttributeName: 'restaurantId', AttributeType: 'S' },
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

  it('should delete a restaurant from DynamoDB', async () => {
    // Create a restaurant to delete
    const createInput: RestaurantInput = {
      name: 'Test Restaurant',
    };
    const createdRestaurant = await createRestaurant(createInput);

    // Ensure the restaurant was created
    expect(createdRestaurant).not.toBeNull();
    expect(createdRestaurant).toHaveProperty('restaurantId');

    if (!createdRestaurant)
      throw new Error('Restaurant should exist before deletion');

    // Delete the restaurant
    await deleteRestaurant(createdRestaurant.restaurantId);

    // Try to fetch the deleted restaurant from DynamoDB
    const response = await dynamoDB
      .getItem({
        TableName: testTableName,
        Key: { restaurantId: { S: createdRestaurant.restaurantId } },
      })
      .promise();

    // Verify the restaurant is no longer in DynamoDB
    expect(response.Item).toBeUndefined();
  });
});
