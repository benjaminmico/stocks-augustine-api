import { DynamoDB } from 'aws-sdk';
import { getDynamoConfig } from 'config/dynamoConfig';
import { RestaurantInput } from 'types/graphql-types';
import { log, logError } from 'utils/logger';
import { v4 as uuid } from 'uuid';

const createRestaurant = async (restaurantInput: RestaurantInput) => {
  const env = process.env.AWS_ENV;

  const docClient = new DynamoDB.DocumentClient({
    ...getDynamoConfig(env),
    params: {
      TableName: process.env.RESTAURANT_TABLE as string,
    },
  });
  const restaurantId = uuid();
  const restaurant = {
    restaurantId,
    ...restaurantInput,
  };

  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: process.env.RESTAURANT_TABLE as string,
    Item: restaurant,
  };

  console.log('params', params);

  try {
    await docClient.put(params).promise();
    log({ message: `Restaurant created with ID: ${restaurant.restaurantId}` });
    return restaurant;
  } catch (err) {
    logError({ message: 'DynamoDB error:', error: err });
    return null;
  }
};

export default createRestaurant;
