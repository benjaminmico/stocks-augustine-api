// lib/product-table.ts

import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as graphqlResolver from '../utils/graphql-resolver';
import { productTable } from './tables/product-table';
import { Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import path = require('path');
import { getDataSourceName } from 'utils/getDataSourceName';
import { restaurantTable } from './tables/restaurant-table';
import { supplierTable } from './tables/supplier-table';
import { menuItemTable } from './tables/menu-item-table';
import { userRestaurantAccessTable } from './tables/user-restaurant-access-table';

const mainCDK = (scope: Stack, api?: appsync.GraphqlApi) => {
  // DynamoDB
  const productDdbTable = productTable(scope);
  const restaurantDdbTable = restaurantTable(scope);
  const supplierDdbTable = supplierTable(scope);
  const menuItemDdbTable = menuItemTable(scope);
  const userRestaurantAccessDdbTable = userRestaurantAccessTable(scope);

  // S3
  const invoiceBucket = new s3.Bucket(scope, 'InvoiceBucket', {
    versioned: true,
    removalPolicy: RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
  });

  // Lambdas
  const userLambda = new lambdaNodeJs.NodejsFunction(
    scope,
    'AppSyncUserHandler',
    {
      functionName: `code-dev-AppSyncUserHandler`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.product',
      entry: path.join(__dirname, `../lambda-fns/index.ts`),
      timeout: Duration.seconds(30),
      memorySize: 1024,
      environment: {
        RESTAURANT_TABLE: restaurantDdbTable.tableName,
        USER_RESTAURANT_ACCESS_TABLE: userRestaurantAccessDdbTable.tableName,
      },
    },
  );

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
        RESTAURANT_TABLE: restaurantDdbTable.tableName,
        SUPPLIER_TABLE: supplierDdbTable.tableName,
        INVOICE_BUCKET_NAME: invoiceBucket.bucketName,
      },
    },
  );

  const restaurantLambda = new lambdaNodeJs.NodejsFunction(
    scope,
    'AppSyncRestaurantHandler',
    {
      functionName: `code-dev-AppSyncRestaurantHandler`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.restaurant',
      entry: path.join(__dirname, `../lambda-fns/index.ts`),
      timeout: Duration.seconds(30),
      memorySize: 1024,
      environment: {
        RESTAURANT_TABLE: restaurantDdbTable.tableName,
      },
    },
  );

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

  const menuLambda = new lambdaNodeJs.NodejsFunction(
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
        SUPPLIER_TABLE: menuItemDdbTable.tableName,
        RESTAURANT_TABLE: restaurantDdbTable.tableName,
      },
    },
  );

  restaurantDdbTable.grantReadWriteData(restaurantLambda);
  restaurantDdbTable.grantReadWriteData(productLambda);
  restaurantDdbTable.grantReadWriteData(userLambda);

  productDdbTable.grantReadWriteData(productLambda);

  supplierDdbTable.grantReadWriteData(supplierLambda);
  supplierDdbTable.grantReadWriteData(productLambda);

  menuItemDdbTable.grantReadWriteData(menuLambda);
  menuItemDdbTable.grantReadWriteData(restaurantLambda);

  userRestaurantAccessDdbTable.grantReadWriteData(restaurantLambda);
  userRestaurantAccessDdbTable.grantReadWriteData(userLambda);

  // Data source
  if (api) {
    const productLambdaDataSource = api.addLambdaDataSource(
      getDataSourceName('product'),
      productLambda,
    );

    // Products
    graphqlResolver.createGraphqlResolver({
      lambdaDataSource: productLambdaDataSource,
      baseResolverProps: { typeName: 'Mutation', fieldName: 'createProduct' },
    });

    graphqlResolver.createGraphqlResolver({
      lambdaDataSource: productLambdaDataSource,
      baseResolverProps: { typeName: 'Mutation', fieldName: 'updateProduct' },
    });

    graphqlResolver.createGraphqlResolver({
      lambdaDataSource: productLambdaDataSource,
      baseResolverProps: { typeName: 'Mutation', fieldName: 'deleteProduct' },
    });

    graphqlResolver.createGraphqlResolver({
      lambdaDataSource: productLambdaDataSource,
      baseResolverProps: { typeName: 'Query', fieldName: 'getProducts' },
    });

    graphqlResolver.createGraphqlResolver({
      lambdaDataSource: productLambdaDataSource,
      baseResolverProps: { typeName: 'Query', fieldName: 'getUploadUrl' },
    });

    graphqlResolver.createGraphqlResolver({
      lambdaDataSource: productLambdaDataSource,
      baseResolverProps: { typeName: 'Mutation', fieldName: 'scanInvoice' },
    });

    // Restaurants
    const restaurantLambdaDataSource = api.addLambdaDataSource(
      getDataSourceName('restaurant'),
      restaurantLambda,
    );

    graphqlResolver.createGraphqlResolver({
      lambdaDataSource: restaurantLambdaDataSource,
      baseResolverProps: {
        typeName: 'Mutation',
        fieldName: 'createRestaurant',
      },
    });

    graphqlResolver.createGraphqlResolver({
      lambdaDataSource: restaurantLambdaDataSource,
      baseResolverProps: {
        typeName: 'Mutation',
        fieldName: 'updateRestaurant',
      },
    });

    graphqlResolver.createGraphqlResolver({
      lambdaDataSource: restaurantLambdaDataSource,
      baseResolverProps: {
        typeName: 'Mutation',
        fieldName: 'deleteRestaurant',
      },
    });

    graphqlResolver.createGraphqlResolver({
      lambdaDataSource: restaurantLambdaDataSource,
      baseResolverProps: { typeName: 'Query', fieldName: 'getRestaurants' },
    });

    // Supplier
    const supplierLambdaDataSource = api.addLambdaDataSource(
      getDataSourceName('supplier'),
      supplierLambda,
    );

    graphqlResolver.createGraphqlResolver({
      lambdaDataSource: supplierLambdaDataSource,
      baseResolverProps: { typeName: 'Mutation', fieldName: 'createSupplier' },
    });

    graphqlResolver.createGraphqlResolver({
      lambdaDataSource: supplierLambdaDataSource,
      baseResolverProps: { typeName: 'Mutation', fieldName: 'updateSupplier' },
    });

    graphqlResolver.createGraphqlResolver({
      lambdaDataSource: supplierLambdaDataSource,
      baseResolverProps: { typeName: 'Mutation', fieldName: 'deleteSupplier' },
    });

    graphqlResolver.createGraphqlResolver({
      lambdaDataSource: supplierLambdaDataSource,
      baseResolverProps: { typeName: 'Query', fieldName: 'getSuppliers' },
    });
  }
};

export default mainCDK;
