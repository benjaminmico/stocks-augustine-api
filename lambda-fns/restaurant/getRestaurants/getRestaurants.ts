import { DynamoDB } from 'aws-sdk';
import { getDynamoConfig } from 'config/dynamoConfig';
import { Restaurant, FilterInput, SortInput } from 'types/graphql-types';
import { log, logError } from 'utils/logger';

const getRestaurants = async (
  filter: FilterInput | null,
  sort: SortInput | null,
  limit: number | null,
  nextToken: string | null,
) => {
  const env = process.env.AWS_ENV;

  const docClient = new DynamoDB.DocumentClient({
    ...getDynamoConfig(env),
    params: {
      TableName: process.env.RESTAURANT_TABLE as string,
    },
  });

  let params:
    | AWS.DynamoDB.DocumentClient.QueryInput
    | AWS.DynamoDB.DocumentClient.ScanInput = {
    TableName: process.env.RESTAURANT_TABLE as string,
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
      ExclusiveStartKey: { restaurantId: nextToken },
    };
  }

  try {
    const data = await docClient.scan(params).promise(); // Use 'query' instead of 'scan' if querying against a specific index
    log({ message: 'Restaurants retrieved' });
    return data.Items as Restaurant[];
  } catch (err) {
    logError({ message: 'DynamoDB error:', error: err });
    return null;
  }
};

export default getRestaurants;
