import { DynamoDB } from 'aws-sdk';
import { getDynamoConfig } from 'config/dynamoConfig';
import { Supplier, SupplierInput } from 'types/graphql-types';
import { log, logError } from 'utils/logger';
import { v4 as uuid } from 'uuid';

const createSupplier = async (supplierInput: SupplierInput) => {
  const env = process.env.AWS_ENV;

  const docClient = new DynamoDB.DocumentClient({
    ...getDynamoConfig(env),
    params: {
      TableName: process.env.SUPPLIER_TABLE as string,
    },
  });
  const supplierId = uuid();
  const supplier: Supplier = {
    supplierId,
    ...supplierInput,
  };

  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: process.env.SUPPLIER_TABLE as string,
    Item: supplier,
  };

  console.log('params', params);

  try {
    await docClient.put(params).promise();
    log({ message: `Supplier created with ID: ${supplier.supplierId}` });
    return supplier;
  } catch (err) {
    logError({ message: 'DynamoDB error:', error: err });
    return null;
  }
};

export default createSupplier;
