import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {
  GraqhQLResolverRequest,
  createGraphqlResolver,
} from './graphql-resolver';
import { getDataSourceName } from 'utils/getDataSourceName';

jest.mock('utils/getDataSourceName');

describe('Graphql Resolver', () => {
  it('should create a graphql resolver', () => {
    // Arrange
    const mockLambdaDataSource = {
      createResolver: jest.fn(),
    };

    const mockApi = {
      addLambdaDataSource: jest.fn(() => mockLambdaDataSource),
    } as unknown as appsync.GraphqlApi;

    const mockLambdaFunction = {} as lambda.Function;
    const mockTypeName = 'Query';
    const mockFieldName = 'getField';

    (getDataSourceName as jest.Mock).mockReturnValue('dataSourceName');

    const request: GraqhQLResolverRequest = {
      api: mockApi,
      lambdaFunction: mockLambdaFunction,
      baseResolverProps: {
        typeName: mockTypeName,
        fieldName: mockFieldName,
      },
    };

    // Act
    createGraphqlResolver(request);

    // Assert
    expect(getDataSourceName).toHaveBeenCalledWith(mockFieldName);
    expect(mockApi.addLambdaDataSource).toHaveBeenCalledWith(
      'dataSourceName',
      mockLambdaFunction,
    );
    expect(mockLambdaDataSource.createResolver).toHaveBeenCalledWith(
      mockFieldName,
      {
        typeName: mockTypeName,
        fieldName: mockFieldName,
      },
    );
  });
});
