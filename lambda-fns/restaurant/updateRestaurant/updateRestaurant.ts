import { DynamoDB } from 'aws-sdk';
import {
  ExpressionAttributeNameMap,
  ExpressionAttributeValueMap,
} from 'aws-sdk/clients/dynamodb';
import { getDynamoConfig } from 'config/dynamoConfig';
import { Restaurant, UpdateRestaurantInput } from 'types/graphql-types';
import { log, logError } from 'utils/logger';

const updateRestaurant = async (updateInput: UpdateRestaurantInput) => {
  const env = process.env.AWS_ENV;

  const docClient = new DynamoDB.DocumentClient({
    ...getDynamoConfig(env),
    params: {
      TableName: process.env.RESTAURANT_TABLE as string,
    },
  });

  const { restaurantId, ...updateData } = updateInput;

  let UpdateExpression = 'set';
  let ExpressionAttributeNames: ExpressionAttributeNameMap = {};
  let ExpressionAttributeValues: ExpressionAttributeValueMap = {};

  Object.entries(updateData).forEach(([key, value]) => {
    if (value !== undefined) {
      UpdateExpression += ` #${key} = :${key},`;
      ExpressionAttributeNames[`#${key}`] = key;
      //@ts-ignore
      ExpressionAttributeValues[`:${key}`] = value;
    }
  });

  // Remove trailing comma
  UpdateExpression = UpdateExpression.slice(0, -1);

  const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: process.env.RESTAURANT_TABLE as string,
    Key: { restaurantId },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await docClient.update(params).promise();
    log({ message: `Restaurant updated with ID: ${restaurantId}` });
    return result.Attributes as Restaurant;
  } catch (err) {
    logError({ message: 'DynamoDB error:', error: err });
    return null;
  }
};

export default updateRestaurant;
