const AWS = require('aws-sdk');
import createRestaurant from './createRestaurant';
import { RestaurantInput } from 'types/graphql-types';

const dynamoDB = new AWS.DynamoDB({
  region: 'local',
  endpoint: 'http://localhost:8000',
});

describe('createRestaurant Integration Test', () => {
  const testTableName = 'TestRestaurantTable';

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

  it('should create a restaurant in DynamoDB', async () => {
    process.env.RESTAURANT_TABLE = testTableName;

    const restaurantInput: RestaurantInput = {
      name: 'Test Restaurant',
    };

    const result = await createRestaurant(restaurantInput);

    expect(result).toHaveProperty('restaurantId');
    expect(result).toHaveProperty('name', restaurantInput.name);

    const response = await dynamoDB
      .getItem({
        TableName: testTableName,
        Key: {
          restaurantId: { S: result?.restaurantId },
        },
      })
      .promise();

    // Assuming all fields are stored as strings in DynamoDB
    const transformedResponse = {
      restaurantId: response.Item.restaurantId.S,
      name: response.Item.name.S,
      price: parseFloat(response.Item.price.N),
      saleFormat: response.Item.saleFormat.S,
      unit: parseFloat(response.Item.unit.N),
      unitOfMeasure: response.Item.unitOfMeasure.S,
      supplierId: response.Item.supplierId ? response.Item.supplierId.S : null,
    };

    expect(transformedResponse).toEqual(
      expect.objectContaining({
        restaurantId: result?.restaurantId,
        ...restaurantInput,
      }),
    );
  });
});
