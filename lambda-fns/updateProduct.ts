import { DynamoDB } from 'aws-sdk';
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

  const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: process.env.PRODUCT_TABLE as string,
    Key: { productId },
    UpdateExpression:
      'set #name = :name, #unit = :unit, #saleFormat = :saleFormat, #price = :price, #unitOfMeasure = :unitOfMeasure, #supplierId = :supplierId',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#unit': 'unit',
      '#saleFormat': 'saleFormat',
      '#price': 'price',
      '#unitOfMeasure': 'unitOfMeasure',
      '#supplierId': 'supplierId',
    },
    ExpressionAttributeValues: {
      ':name': updateData.name,
      ':unit': updateData.unit,
      ':saleFormat': updateData.saleFormat,
      ':price': updateData.price,
      ':unitOfMeasure': updateData.unitOfMeasure,
      ':supplierId': updateData.supplierId,
    },
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
