// lib/product-table.ts

import { Stack } from 'aws-cdk-lib';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';

export const userRestaurantAccessTable = (scope: Stack): ddb.Table =>
  new ddb.Table(scope, 'UserRestaurantAccessTable', {
    billingMode: ddb.BillingMode.PAY_PER_REQUEST,
    partitionKey: {
      name: 'userId',
      type: ddb.AttributeType.STRING,
    },
    sortKey: {
      name: 'restaurantId',
      type: ddb.AttributeType.STRING,
    },
  });
