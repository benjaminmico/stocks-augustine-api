import { DynamoDB } from 'aws-sdk';
import { getDynamoConfig } from 'config/dynamoConfig';
import { log, logError } from 'utils/logger';

const deleteProduct = async (productId: string) => {
  const env = process.env.AWS_ENV;

  const docClient = new DynamoDB.DocumentClient({
    ...getDynamoConfig(env),
    params: {
      TableName: process.env.PRODUCT_TABLE as string,
    },
  });

  const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
    TableName: process.env.PRODUCT_TABLE as string,
    Key: {
      productId,
    },
  };

  console.log('Deleting product with params:', params);

  try {
    await docClient.delete(params).promise();
    log({ message: `Product deleted with ID: ${productId}` });
  } catch (err) {
    logError({ message: 'DynamoDB error:', error: err });
    return null;
  }

  return productId;
};

export default deleteProduct;
