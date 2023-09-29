import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import createUserPool from './user-pool';

describe('Cognito User Pool Tests', () => {
  test('User Pool Created with Correct Configurations', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    createUserPool(stack);

    const assertTemplate = Template.fromStack(stack);

    assertTemplate.hasResourceProperties('AWS::Cognito::UserPool', {
      AutoVerifiedAttributes: ['email'],
      Schema: [
        {
          Name: 'email',
          Required: true,
          Mutable: true,
        },
      ],
    });

    // Check for the presence of a UserPoolClient resource
    // assertTemplate.resourceOfType('AWS::Cognito::UserPoolClient');
    //
    assertTemplate.hasResourceProperties('AWS::Cognito::UserPoolGroup', {
      GroupName: 'Admin',
      Description: 'Admin group for managing administrative privileges',
    });
  });
});
