// lib/course-table.ts

import { Stack } from 'aws-cdk-lib';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export const courseTable = (scope: Stack) =>
  new ddb.Table(scope, 'CDKCourseTable', {
    billingMode: ddb.BillingMode.PAY_PER_REQUEST,
    partitionKey: {
      name: 'id',
      type: ddb.AttributeType.STRING,
    },
  });
