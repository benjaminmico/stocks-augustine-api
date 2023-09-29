import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export const createApi = (scope: Construct, userPool: cognito.UserPool) => {
  const api = new appsync.GraphqlApi(scope, 'cdk-wondercode-app', {
    name: 'cdk-wondercode-api',
    logConfig: {
      fieldLogLevel: appsync.FieldLogLevel.ALL,
    },
    schema: appsync.SchemaFile.fromAsset('./graphql/schema.graphql'),
    authorizationConfig: {
      defaultAuthorization: {
        authorizationType: appsync.AuthorizationType.API_KEY,
      },
      additionalAuthorizationModes: [
        {
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool,
          },
        },
      ],
    },
  });

  return api;
};
