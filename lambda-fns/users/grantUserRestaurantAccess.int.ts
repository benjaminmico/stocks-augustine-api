const AWS = require('aws-sdk');
import grantUserRestaurantAccess from './grantUserRestaurantAccess';

// Setup DynamoDB to point to your local or test instance
const dynamoDB = new AWS.DynamoDB({
  region: 'local',
  endpoint: 'http://localhost:8000',
});

describe('grantUserRestaurantAccess Integration Test', () => {
  const testTableName = 'TestUserRestaurantAccessTable';

  beforeAll(async () => {
    // Use DynamoDB to create the table
    await dynamoDB
      .createTable({
        TableName: testTableName,
        KeySchema: [
          { AttributeName: 'userId', KeyType: 'HASH' }, // Partition key
          { AttributeName: 'restaurantId', KeyType: 'RANGE' }, // Sort key
        ],
        AttributeDefinitions: [
          { AttributeName: 'userId', AttributeType: 'S' },
          { AttributeName: 'restaurantId', AttributeType: 'S' },
        ],
        BillingMode: 'PAY_PER_REQUEST',
      })
      .promise();

    console.log(`Table ${testTableName} has been created.`);
  }, 30000); // Extended timeout for table creation

  afterAll(async () => {
    // Cleanup the table after tests are done
    await dynamoDB.deleteTable({ TableName: testTableName }).promise();
    console.log(`Table ${testTableName} has been deleted.`);
  });

  it('should grant a user access to a restaurant in DynamoDB', async () => {
    process.env.USER_RESTAURANT_ACCESS_TABLE = testTableName; // Ensure your function uses this env var

    const testUserId = 'test-user-id';
    const testRestaurantId = 'test-restaurant-id';

    // Call your function to test
    const result = await grantUserRestaurantAccess(
      testUserId,
      testRestaurantId,
    );

    console.log('cccc', result);

    // Assertions to ensure the function executed as expected
    expect(result).toHaveProperty('userId', testUserId);
    expect(result).toHaveProperty('restaurantId', testRestaurantId);

    // Fetch the item from DynamoDB to verify it was inserted correctly
    const response = await dynamoDB
      .get({
        TableName: testTableName,
        Key: {
          userId: testUserId,
          restaurantId: testRestaurantId,
        },
      })
      .promise();

    // Verify the response matches the expected values
    expect(response.Item).not.toBeUndefined();
    expect(response.Item).toMatchObject({
      userId: testUserId,
      restaurantId: testRestaurantId,
    });
  });
});
