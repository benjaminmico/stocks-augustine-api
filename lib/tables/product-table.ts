// lib/product-table.ts

import { Stack } from 'aws-cdk-lib';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';

export const productTable = (scope: Stack): ddb.Table =>
  new ddb.Table(scope, 'ProductTable', {
    billingMode: ddb.BillingMode.PAY_PER_REQUEST,
    partitionKey: {
      name: 'productId',
      type: ddb.AttributeType.STRING,
    },
  });
