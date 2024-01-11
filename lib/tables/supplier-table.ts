// lib/supplier-table.ts

import { Stack } from 'aws-cdk-lib';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';

export const supplierTable = (scope: Stack): ddb.Table =>
  new ddb.Table(scope, 'SupplierTable', {
    billingMode: ddb.BillingMode.PAY_PER_REQUEST,
    partitionKey: {
      name: 'supplierId',
      type: ddb.AttributeType.STRING,
    },
  });
