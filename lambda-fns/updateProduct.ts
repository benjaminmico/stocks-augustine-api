import { DynamoDB } from 'aws-sdk';
import {
  ExpressionAttributeNameMap,
  ExpressionAttributeValueMap,
} from 'aws-sdk/clients/dynamodb';
import { getDynamoConfig } from 'config/dynamoConfig';
import { Product, UpdateProductInput } from 'types/graphql-types';
import { log, logError } from 'utils/logger';

const updateProduct = async (updateInput: UpdateProductInput) => {
  const env = process.env.AWS_ENV;

  const docClient = new DynamoDB.DocumentClient({
    ...getDynamoConfig(env),
    params: {
      TableName: process.env.PRODUCT_TABLE as string,
    },
  });

  const { productId, ...updateData } = updateInput;

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
    TableName: process.env.PRODUCT_TABLE as string,
    Key: { productId },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await docClient.update(params).promise();
    log({ message: `Product updated with ID: ${productId}` });
    return result.Attributes as Product;
  } catch (err) {
    logError({ message: 'DynamoDB error:', error: err });
    return null;
  }
};

export default updateProduct;
