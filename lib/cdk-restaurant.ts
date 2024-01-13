// lib/restaurant-table.ts

import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as graphqlResolver from '../utils/graphql-resolver';
import { restaurantTable } from './tables/restaurant-table';
import { Duration, Stack } from 'aws-cdk-lib';
import path = require('path');
import { getDataSourceName } from 'utils/getDataSourceName';

const createRestaurantCDK = (scope: Stack, api?: appsync.GraphqlApi) => {
  const restaurantDdbTable = restaurantTable(scope);

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
  restaurantDdbTable.grantReadWriteData(restaurantLambda);

  if (api) {
    const lambdaDataSource = api.addLambdaDataSource(
      getDataSourceName('restaurant'),
      restaurantLambda,
    );

    graphqlResolver.createGraphqlResolver({
      lambdaDataSource,
      baseResolverProps: {
        typeName: 'Mutation',
        fieldName: 'createRestaurant',
      },
    });

    graphqlResolver.createGraphqlResolver({
      lambdaDataSource,
      baseResolverProps: {
        typeName: 'Mutation',
        fieldName: 'updateRestaurant',
      },
    });

    graphqlResolver.createGraphqlResolver({
      lambdaDataSource,
      baseResolverProps: {
        typeName: 'Mutation',
        fieldName: 'deleteRestaurant',
      },
    });

    graphqlResolver.createGraphqlResolver({
      lambdaDataSource,
      baseResolverProps: { typeName: 'Query', fieldName: 'getRestaurants' },
    });
  }
};

export default createRestaurantCDK;
