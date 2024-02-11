// lib/index.ts

import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as api from './api';
import createUserPool from './cognito/user-pool';
import mainCDK from './cdk-main';

export class CodeStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create the Cognito User Pool
    const cognitoUserPool = createUserPool(this);

    // Create the AppSync API
    const graphqlApi = api.createApi(this, cognitoUserPool.userPool);

    // Create tables, lambdas and GraphQL resolvers
    mainCDK(this, graphqlApi);
  }
}
