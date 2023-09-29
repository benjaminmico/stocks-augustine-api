// lib/course-table.ts

import { Stack } from 'aws-cdk-lib';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';

export const courseTable = (scope: Stack): ddb.Table =>
  new ddb.Table(scope, 'CourseTable', {
    billingMode: ddb.BillingMode.PAY_PER_REQUEST,
    partitionKey: {
      name: 'id',
      type: ddb.AttributeType.STRING,
    },
  });
