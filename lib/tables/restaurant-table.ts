// lib/restaurant-table.ts

import { Stack } from 'aws-cdk-lib';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';

export const restaurantTable = (scope: Stack): ddb.Table =>
  new ddb.Table(scope, 'RestaurantTable', {
    billingMode: ddb.BillingMode.PAY_PER_REQUEST,
    partitionKey: {
      name: 'restaurantId',
      type: ddb.AttributeType.STRING,
    },
  });
