import { DynamoDB } from 'aws-sdk';
import { getDynamoConfig } from 'config/dynamoConfig';
import { Supplier, FilterInput, SortInput } from 'types/graphql-types'; // Assuming similar types exist for Supplier
import { log, logError } from 'utils/logger';

const getSuppliers = async (
  filter: FilterInput | null,
  sort: SortInput | null,
  limit: number | null,
  nextToken: string | null,
) => {
  const env = process.env.AWS_ENV;

  const docClient = new DynamoDB.DocumentClient({
    ...getDynamoConfig(env),
    params: {
      TableName: process.env.SUPPLIER_TABLE as string, // Use your suppliers table name
    },
  });

  let params:
    | AWS.DynamoDB.DocumentClient.QueryInput
    | AWS.DynamoDB.DocumentClient.ScanInput = {
    TableName: process.env.SUPPLIER_TABLE as string,
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
    // Add sorting logic here, similar to products
  }

  // Handle pagination
  if (nextToken) {
    params = {
      ...params,
      ExclusiveStartKey: { supplierId: nextToken }, // Adjust the key as per your schema
    };
  }

  try {
    const data = await docClient.scan(params).promise(); // Use 'query' for specific index
    log({ message: 'Suppliers retrieved' });
    return data.Items as Supplier[];
  } catch (err) {
    logError({ message: 'DynamoDB error:', error: err });
    return null;
  }
};

export default getSuppliers;
