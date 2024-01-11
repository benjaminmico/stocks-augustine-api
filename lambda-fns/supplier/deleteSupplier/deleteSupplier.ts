import { DynamoDB } from 'aws-sdk';
import { getDynamoConfig } from 'config/dynamoConfig';
import { log, logError } from 'utils/logger';

const deleteSupplier = async (supplierId: string) => {
  const env = process.env.AWS_ENV;

  const docClient = new DynamoDB.DocumentClient({
    ...getDynamoConfig(env),
    params: {
      TableName: process.env.SUPPLIER_TABLE as string,
    },
  });

  const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
    TableName: process.env.SUPPLIER_TABLE as string,
    Key: {
      supplierId,
    },
  };

  console.log('Deleting supplier with params:', params);

  try {
    await docClient.delete(params).promise();
    log({ message: `Supplier deleted with ID: ${supplierId}` });
  } catch (err) {
    logError({ message: 'DynamoDB error:', error: err });
    return null;
  }

  return supplierId;
};

export default deleteSupplier;
