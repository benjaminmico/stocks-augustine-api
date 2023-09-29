import { Stack } from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Template } from 'aws-cdk-lib/assertions';
import { createApi } from './api';

describe('AppSync API Tests', () => {
  test('AppSync API Created with Correct Configurations', () => {
    // Given
    const stack = new Stack();
    const userPool = new cognito.UserPool(stack, 'TestUserPool');

    // When
    createApi(stack, userPool);

    // Then
    const assertTemplate = Template.fromStack(stack);
    const resources = assertTemplate.findResources('AWS::AppSync::GraphQLApi');

    expect(resources).toEqual({
      cdkcodeapp43A2FCCB: {
        Properties: {
          AdditionalAuthenticationProviders: [
            {
              AuthenticationType: 'AMAZON_COGNITO_USER_POOLS',
              UserPoolConfig: {
                AwsRegion: { Ref: 'AWS::Region' },
                UserPoolId: { Ref: 'TestUserPool83C2ABD0' },
              },
            },
          ],
          AuthenticationType: 'API_KEY',
          LogConfig: {
            CloudWatchLogsRoleArn: {
              'Fn::GetAtt': ['cdkcodeappApiLogsRole6CBA569F', 'Arn'],
            },
            FieldLogLevel: 'ALL',
          },
          Name: 'cdk-code-api',
        },
        Type: 'AWS::AppSync::GraphQLApi',
      },
    });

    const graphQlApi = resources[0];
  });
});
