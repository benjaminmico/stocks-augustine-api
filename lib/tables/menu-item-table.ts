// lib/menu-item-table.ts

import { Stack } from 'aws-cdk-lib';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';

export const menuItemTable = (scope: Stack): ddb.Table =>
  new ddb.Table(scope, 'MenuItemTable', {
    billingMode: ddb.BillingMode.PAY_PER_REQUEST,
    partitionKey: {
      name: 'menuItemId',
      type: ddb.AttributeType.STRING,
    },
  });
