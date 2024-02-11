import { DynamoDB } from 'aws-sdk';
import { getDynamoConfig } from 'config/dynamoConfig';
import { ProductInput } from 'types/graphql-types';
import { doesDynamoDBEntryExist } from 'utils/dynamodb';
import { log, logError } from 'utils/logger';
import { v4 as uuid } from 'uuid';

const createProduct = async (productInput: ProductInput) => {
  const env = process.env.AWS_ENV;

  const restaurantExists = await doesDynamoDBEntryExist(
    'restaurantId',
    productInput.restaurantId,
    process.env.RESTAURANT_TABLE as string,
    env,
  );
  if (!restaurantExists) {
    logError({
      message: `Restaurant with ID ${productInput.restaurantId} does not exist`,
    });
    return null;
  }

  const docClient = new DynamoDB.DocumentClient({
    ...getDynamoConfig(env),
    params: {
      TableName: process.env.PRODUCT_TABLE as string,
    },
  });
  const productId = uuid();
  const product = {
    productId,
    ...productInput,
  };

  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: process.env.PRODUCT_TABLE as string,
    Item: product,
  };

  try {
    await docClient.put(params).promise();
    log({ message: `Product created with ID: ${product.productId}` });
    return product;
  } catch (err) {
    logError({ message: 'DynamoDB error:', error: err });
    return null;
  }
};

export default createProduct;
