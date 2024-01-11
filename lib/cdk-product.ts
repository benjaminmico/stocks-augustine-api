// lib/product-table.ts

import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as graphqlResolver from '../utils/graphql-resolver';
import { productTable } from './tables/product-table';
import { Duration, Stack } from 'aws-cdk-lib';
import path = require('path');
import { getDataSourceName } from 'utils/getDataSourceName';

const createProductCDK = (scope: Stack, api?: appsync.GraphqlApi) => {
  const productDdbTable = productTable(scope);

  const productLambda = new lambdaNodeJs.NodejsFunction(
    scope,
    'AppSyncProductHandler',
    {
      functionName: `code-dev-AppSyncProductHandler`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.product',
      entry: path.join(__dirname, `../lambda-fns/index.ts`),
      timeout: Duration.seconds(30),
      memorySize: 1024,
      environment: {
        PRODUCT_TABLE: productDdbTable.tableName,
      },
    },
  );
  productDdbTable.grantReadWriteData(productLambda);

  if (api) {
    const lambdaDataSource = api.addLambdaDataSource(
      getDataSourceName('product'),
      productLambda,
    );

    graphqlResolver.createGraphqlResolver({
      lambdaDataSource,
      baseResolverProps: { typeName: 'Mutation', fieldName: 'createProduct' },
    });

    graphqlResolver.createGraphqlResolver({
      lambdaDataSource,
      baseResolverProps: { typeName: 'Mutation', fieldName: 'updateProduct' },
    });

    graphqlResolver.createGraphqlResolver({
      lambdaDataSource,
      baseResolverProps: { typeName: 'Mutation', fieldName: 'deleteProduct' },
    });

    graphqlResolver.createGraphqlResolver({
      lambdaDataSource,
      baseResolverProps: { typeName: 'Query', fieldName: 'getProducts' },
    });
  }
};

export default createProductCDK;
