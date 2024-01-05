import { DynamoDB } from 'aws-sdk';
import { getDynamoConfig } from 'config/dynamoConfig';
import { Product, ProductInput } from 'types/graphql-types';
import { log, logError } from 'utils/logger';
import { v4 as uuid } from 'uuid';

const env = process.env.NODE_ENV || 'LOCAL';
const config = getDynamoConfig(env);

const docClient = new DynamoDB.DocumentClient(config);

const createProduct = async (productInput: ProductInput) => {
  const productId = uuid();
  const product: Product = {
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
