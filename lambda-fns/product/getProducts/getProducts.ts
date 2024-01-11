import { DynamoDB } from 'aws-sdk';
import { getDynamoConfig } from 'config/dynamoConfig';
import { Product, FilterInput, SortInput } from 'types/graphql-types';
import { log, logError } from 'utils/logger';

const getProducts = async (
  filter: FilterInput | null,
  sort: SortInput | null,
  limit: number | null,
  nextToken: string | null,
) => {
  const env = process.env.AWS_ENV;

  const docClient = new DynamoDB.DocumentClient({
    ...getDynamoConfig(env),
    params: {
      TableName: process.env.PRODUCT_TABLE as string,
    },
  });

  let params:
    | AWS.DynamoDB.DocumentClient.QueryInput
    | AWS.DynamoDB.DocumentClient.ScanInput = {
    TableName: process.env.PRODUCT_TABLE as string,
    Limit: limit || undefined,
  };

  // Handle filtering
  if (filter) {
    params = {
      ...params,
      FilterExpression: '#attrName = :attrValue',
      ExpressionAttributeNames: {
        '#attrName': filter.attributeName,
      },
      ExpressionAttributeValues: {
        ':attrValue': filter.attributeValue,
      },
    };
  }

  // Handle sorting
  if (sort) {
    // Assuming 'sort.attributeName' is a valid range key for sorting
    params = {
      ...params,
      IndexName: 'YourIndexName', // Replace with your index name if sorting on a secondary index
      KeyConditionExpression: '#sortAttr = :sortVal',
      ExpressionAttributeNames: {
        '#sortAttr': sort.attributeName,
      },
      ScanIndexForward: sort.direction === 'ASC', // true for ascending, false for descending
    };
  }

  // Handle pagination
  if (nextToken) {
    params = {
      ...params,
      ExclusiveStartKey: { productId: nextToken },
    };
  }

  try {
    const data = await docClient.scan(params).promise(); // Use 'query' instead of 'scan' if querying against a specific index
    log({ message: 'Products retrieved' });
    return data.Items as Product[];
  } catch (err) {
    logError({ message: 'DynamoDB error:', error: err });
    return null;
  }
};

export default getProducts;
