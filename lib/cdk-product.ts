// lib/product-table.ts

import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as graphqlResolver from './graphql-resolver';
import { productTable } from './tables/product-table';
import { Duration, Stack } from 'aws-cdk-lib';
import path = require('path');

const productCDK = (scope: Stack, api?: appsync.GraphqlApi) => {
  const productDdbTable = productTable(scope);

  const productLambda = new lambdaNodeJs.NodejsFunction(
    scope,
    'AppSyncProductHandler',
    {
      functionName: `code-dev-AppSyncProductHandler`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler', // Ensure your Lambda entry file has a handler that can route to different operations
      entry: path.join(__dirname, `../lambda-fns/index.ts`),
      timeout: Duration.seconds(30),
      memorySize: 1024,
      environment: {
        PRODUCT_TABLE: productDdbTable.tableName,
      },
    },
  );
  productDdbTable.grantReadWriteData(productLambda);

  // Create Mutation for createProduct
  if (api) {
    graphqlResolver.createGraphqlResolver({
      api,
      lambdaFunction: productLambda,
      baseResolverProps: { typeName: 'Mutation', fieldName: 'createProduct' },
    });

    // Create Mutation for updateProduct
    graphqlResolver.createGraphqlResolver({
      api,
      lambdaFunction: productLambda,
      baseResolverProps: { typeName: 'Mutation', fieldName: 'updateProduct' },
    });

    // Create Query for getProducts
    graphqlResolver.createGraphqlResolver({
      api,
      lambdaFunction: productLambda,
      baseResolverProps: { typeName: 'Query', fieldName: 'getProducts' },
    });
  }
};

export default productCDK;
