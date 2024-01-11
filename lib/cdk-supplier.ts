// lib/supplier-table.ts

import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as graphqlResolver from '../utils/graphql-resolver';
import { supplierTable } from './tables/supplier-table';
import { Duration, Stack } from 'aws-cdk-lib';
import path = require('path');
import { getDataSourceName } from 'utils/getDataSourceName';

const createSupplierCDK = (scope: Stack, api?: appsync.GraphqlApi) => {
  const supplierDdbTable = supplierTable(scope);

  const supplierLambda = new lambdaNodeJs.NodejsFunction(
    scope,
    'AppSyncSupplierHandler',
    {
      functionName: `code-dev-AppSyncSupplierHandler`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.supplier',
      entry: path.join(__dirname, `../lambda-fns/index.ts`),
      timeout: Duration.seconds(30),
      memorySize: 1024,
      environment: {
        SUPPLIER_TABLE: supplierDdbTable.tableName,
      },
    },
  );
  supplierDdbTable.grantReadWriteData(supplierLambda);

  if (api) {
    const lambdaDataSource = api.addLambdaDataSource(
      getDataSourceName('supplier'),
      supplierLambda,
    );

    graphqlResolver.createGraphqlResolver({
      lambdaDataSource,
      baseResolverProps: { typeName: 'Mutation', fieldName: 'createSupplier' },
    });

    graphqlResolver.createGraphqlResolver({
      lambdaDataSource,
      baseResolverProps: { typeName: 'Mutation', fieldName: 'updateSupplier' },
    });

    graphqlResolver.createGraphqlResolver({
      lambdaDataSource,
      baseResolverProps: { typeName: 'Query', fieldName: 'getSuppliers' },
    });
  }
};

export default createSupplierCDK;
