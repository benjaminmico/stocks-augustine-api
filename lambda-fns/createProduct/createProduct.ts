import { DynamoDB } from 'aws-sdk';
import { getDynamoConfig } from 'config/dynamoConfig';
import { Product, ProductInput } from 'types/graphql-types';
import { log, logError } from 'utils/logger';
import { v4 as uuid } from 'uuid';

const createProduct = async (productInput: ProductInput) => {
  const env = process.env.AWS_ENV;

  const docClient = new DynamoDB.DocumentClient({
    ...getDynamoConfig(env),
    params: {
      TableName: 'PRODUCT_TABLE',
    },
  });
  const productId = uuid();
  const product: Product = {
    productId,
    ...productInput,
  };

  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: 'PRODUCT_TABLE',
    Item: product,
  };

  console.log('params', params);

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
