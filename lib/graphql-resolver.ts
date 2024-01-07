// lib/graphql-resolver.ts

import * as appsync from 'aws-cdk-lib/aws-appsync';

export type GraphQLResolverRequest = {
  lambdaDataSource: appsync.LambdaDataSource;
  baseResolverProps: appsync.BaseResolverProps;
};

export const createGraphqlResolver = (
  graphQLResolverRequest: GraphQLResolverRequest,
) => {
  const {
    lambdaDataSource,
    baseResolverProps: { typeName, fieldName },
  } = graphQLResolverRequest;

  lambdaDataSource.createResolver(fieldName, {
    typeName,
    fieldName,
  });
};
