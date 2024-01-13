import { DynamoDB } from 'aws-sdk';
import { getDynamoConfig } from 'config/dynamoConfig';
import { logError } from './logger';

// Helper function to check if an entry with a given ID exists in a specified table
export const doesDynamoDBEntryExist = async (
  id: string,
  tableName: string,
  env?: string,
): Promise<boolean> => {
  try {
    const docClient = new DynamoDB.DocumentClient(getDynamoConfig(env));

    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
      TableName: tableName,
      Key: {
        id,
      },
    };

    const result = await docClient.get(params).promise();
    return !!result.Item;
  } catch (err) {
    logError({
      message: `Error checking existence in ${tableName}:`,
      error: err,
    });
    return false;
  }
};
