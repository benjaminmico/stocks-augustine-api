// lib/course-table.ts

import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as graphqlResolver from './graphql-resolver';
import { courseTable } from './tables/course-table';
import { Duration, Stack } from 'aws-cdk-lib';
import path = require('path');

const createCourseCDK = (scope: Stack, api?: appsync.GraphqlApi) => {
  const courseDdbTable = courseTable(scope);

  const courseLambda = new lambdaNodeJs.NodejsFunction(
    scope,
    'AppSyncCourseHandler',
    {
      functionName: `code-dev-AppSyncCourseHandler`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.course',
      entry: path.join(__dirname, `../lambda-fns/index.ts`),
      timeout: Duration.seconds(30),
      memorySize: 1024,
      environment: {
        COURSE_TABLE: courseDdbTable.tableName,
      },
    },
  );
  courseDdbTable.grantReadWriteData(courseLambda);

  // Create Mutation
  if (api) {
    const courseGraphQLResolver = {
      api,
      lambdaFunction: courseLambda,
      baseResolverProps: { typeName: 'Mutation', fieldName: 'createCourse' },
    };
    graphqlResolver.createGraphqlResolver(courseGraphQLResolver);
  }
};

export default createCourseCDK;
