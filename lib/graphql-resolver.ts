// lib/graphql-resolver.ts

import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { getDataSourceName } from 'utils/getDataSourceName';

export type GraqhQLResolverRequest = {
  api: appsync.GraphqlApi;
  lambdaFunction: lambda.Function;
  baseResolverProps: appsync.BaseResolverProps;
};

export const createGraphqlResolver = (
  graqhQLResolverRequest: GraqhQLResolverRequest,
) => {
  const {
    api,
    lambdaFunction,
    baseResolverProps: { typeName, fieldName },
  } = graqhQLResolverRequest;

  const lambdaDataSource = api.addLambdaDataSource(
    getDataSourceName(fieldName),
    lambdaFunction,
  );

  lambdaDataSource.createResolver(fieldName, {
    typeName,
    fieldName,
  });
};
