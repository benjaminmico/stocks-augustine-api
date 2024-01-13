import { DynamoDB } from 'aws-sdk';
import { getDynamoConfig } from 'config/dynamoConfig';
import { log, logError } from 'utils/logger';

const deleteRestaurant = async (restaurantId: string) => {
  const env = process.env.AWS_ENV;

  const docClient = new DynamoDB.DocumentClient({
    ...getDynamoConfig(env),
    params: {
      TableName: process.env.RESTAURANT_TABLE as string,
    },
  });

  const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
    TableName: process.env.RESTAURANT_TABLE as string,
    Key: {
      restaurantId,
    },
  };

  console.log('Deleting restaurant with params:', params);

  try {
    await docClient.delete(params).promise();
    log({ message: `Restaurant deleted with ID: ${restaurantId}` });
  } catch (err) {
    logError({ message: 'DynamoDB error:', error: err });
    return null;
  }

  return restaurantId;
};

export default deleteRestaurant;
