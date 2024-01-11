import { DynamoDB } from 'aws-sdk';
import {
  ExpressionAttributeNameMap,
  ExpressionAttributeValueMap,
} from 'aws-sdk/clients/dynamodb';
import { getDynamoConfig } from 'config/dynamoConfig';
import { Supplier, UpdateSupplierInput } from 'types/graphql-types';
import { log, logError } from 'utils/logger';

const updateSupplier = async (updateInput: UpdateSupplierInput) => {
  const env = process.env.AWS_ENV;

  const docClient = new DynamoDB.DocumentClient({
    ...getDynamoConfig(env),
    params: {
      TableName: process.env.SUPPLIER_TABLE as string,
    },
  });

  const { supplierId, ...updateData } = updateInput;

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
    TableName: process.env.SUPPLIER_TABLE as string,
    Key: { supplierId },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await docClient.update(params).promise();
    log({ message: `Supplier updated with ID: ${supplierId}` });
    return result.Attributes as Supplier;
  } catch (err) {
    logError({ message: 'DynamoDB error:', error: err });
    return null;
  }
};

export default updateSupplier;
