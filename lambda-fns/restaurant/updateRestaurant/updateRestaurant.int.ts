const AWS = require('aws-sdk');
import createRestaurant from '../createRestaurant/createRestaurant';
import updateRestaurant from './updateRestaurant';
import {
  RestaurantInput,
  UpdateRestaurantInput,
  SaleFormat,
  UnitOfMeasure,
} from 'types/graphql-types';

const dynamoDB = new AWS.DynamoDB({
  region: 'local',
  endpoint: 'http://localhost:8000',
});

const testTableName = 'RESTAURANT_TABLE';
process.env.AWS_ENV = 'LOCAL';
process.env.RESTAURANT_TABLE = testTableName;

describe('updateRestaurant Integration Test', () => {
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

  it('should update a restaurant in DynamoDB', async () => {
    // Create a restaurant to update
    const createInput: RestaurantInput = {
      name: 'Initial Restaurant',
    };
    const createdRestaurant = await createRestaurant(createInput);

    // Ensure the restaurant was created before attempting to update it
    expect(createdRestaurant).not.toBeNull();
    expect(createdRestaurant).toHaveProperty('restaurantId');

    if (!createdRestaurant) throw new Error('restaurant should exists');

    // Define the update input
    const updateInput: UpdateRestaurantInput = {
      restaurantId: createdRestaurant.restaurantId,
      name: 'Updated Test Restaurant',
    };

    // Update the restaurant
    const updateResult = await updateRestaurant(updateInput);

    // Verify the update result
    expect(updateResult).toHaveProperty(
      'restaurantId',
      updateInput.restaurantId,
    );
    expect(updateResult).toHaveProperty('name', updateInput.name);

    // Fetch the updated restaurant from DynamoDB
    const response = await dynamoDB
      .getItem({
        TableName: testTableName,
        Key: { restaurantId: { S: updateInput.restaurantId } },
      })
      .promise();

    // Verify the restaurant in DynamoDB is updated
    expect(response.Item).not.toBeNull();
    expect(response.Item.name.S).toEqual(updateInput.name);
    // ... other assertions based on updated fields
  });
});
