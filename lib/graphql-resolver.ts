// lib/graphql-resolver.ts

import * as appsync from 'aws-cdk-lib/aws-appsync';

export type GraphQLResolverRequest = {
  api: appsync.GraphqlApi;
  lambdaDataSource: appsync.LambdaDataSource;
  baseResolverProps: appsync.BaseResolverProps;
};

export const createGraphqlResolver = (
  graphQLResolverRequest: GraphQLResolverRequest,
) => {
  const {
    api,
    lambdaDataSource,
    baseResolverProps: { typeName, fieldName },
  } = graphQLResolverRequest;

  lambdaDataSource.createResolver(fieldName, {
    typeName,
    fieldName,
  });
};
