import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

const createUserPool = (scope: Construct) => {
  const userPool = new cognito.UserPool(scope, 'code-backend-user-pool', {
    selfSignUpEnabled: true,
    accountRecovery: cognito.AccountRecovery.PHONE_AND_EMAIL,
    userVerification: {
      emailStyle: cognito.VerificationEmailStyle.CODE,
    },
    autoVerify: {
      email: true,
    },
    standardAttributes: {
      email: {
        required: true,
        mutable: true,
      },
    },
  });

  const userPoolClient = new cognito.UserPoolClient(scope, 'UserPoolClient', {
    userPool,
  });

  // Create an admin group
  const adminGroup = new cognito.CfnUserPoolGroup(scope, 'AdminGroup', {
    userPoolId: userPool.userPoolId,
    groupName: 'Admin',
    description: 'Admin group for managing administrative privileges',
  });

  return { userPool, userPoolClient, adminGroup };
};

export default createUserPool;
