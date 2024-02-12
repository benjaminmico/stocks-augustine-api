import { DynamoDB, CognitoIdentityServiceProvider } from 'aws-sdk';
import { getDynamoConfig } from 'config/dynamoConfig';
import { log, logError } from 'utils/logger';

const grantUserRestaurantAccess = async (
  userId: string,
  restaurantId: string,
) => {
  const env = process.env.AWS_ENV;

  // Initialize DynamoDB DocumentClient
  const docClient = new DynamoDB.DocumentClient({
    ...getDynamoConfig(env),
    params: {
      TableName: process.env.USER_RESTAURANT_ACCESS_TABLE as string,
    },
  });

  // Initialize CognitoIdentityServiceProvider
  const cognito = new CognitoIdentityServiceProvider();

  const accessRecord = {
    userId,
    restaurantId,
  };

  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: process.env.USER_RESTAURANT_ACCESS_TABLE as string,
    Item: accessRecord,
  };

  try {
    // Save access record to DynamoDB
    await docClient.put(params).promise();
    log({
      message: `Access granted to userId: ${userId} for restaurantId: ${restaurantId}`,
    });

    // Update user attributes in Cognito User Pool
    await cognito
      .adminUpdateUserAttributes({
        UserPoolId: process.env.COGNITO_USER_POOL_ID as string, // Your Cognito User Pool ID
        Username: userId, // The username or user sub of the Cognito user
        UserAttributes: [
          {
            Name: 'custom:restaurantId', // The custom attribute you want to update
            Value: restaurantId, // The new value for the custom attribute
          },
        ],
      })
      .promise();

    log({ message: `Cognito user attributes updated for userId: ${userId}` });
    return accessRecord;
  } catch (err) {
    logError({ message: 'Error:', error: err });
    return null;
  }
};

export default grantUserRestaurantAccess;
