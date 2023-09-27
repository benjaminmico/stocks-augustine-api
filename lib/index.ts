// lib/index.ts

import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as api from './api';
import createCourseCDK from './cdk-course';
import createUserPool from './cognito/user-pool';

export class CodeStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create the Cognito User Pool
    const cognitoUserPool = createUserPool(this);

    // Create the AppSync API
    const graphqlApi = api.createApi(this, cognitoUserPool.userPool);

    // Create tables, lambdas and GraphQL resolvers
    createCourseCDK(this, graphqlApi);
  }
}
