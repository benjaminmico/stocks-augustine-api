import { Stack } from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as courseTableModule from './tables/course-table';
import * as graphqlResolverModule from './graphql-resolver';
import createCourseCDK from './cdk-course';

jest.mock('aws-cdk-lib/aws-appsync');
jest.mock('./tables/course-table');
jest.mock('./graphql-resolver');

describe('Create Course CDK', () => {
  let stack: Stack;
  let api: appsync.GraphqlApi;

  beforeEach(() => {
    stack = new Stack();
    api = new appsync.GraphqlApi(stack, 'TestApi', {
      name: 'TestApi',
    });

    const mockCourseTable =
      courseTableModule.courseTable as jest.MockedFunction<
        typeof courseTableModule.courseTable
      >;

    mockCourseTable.mockReturnValue({
      tableName: 'mockTableName',
      tableArn: 'mockTableArn',
      grantReadWriteData: jest.fn(),
    } as unknown as ReturnType<typeof courseTableModule.courseTable>);

    jest.clearAllMocks();
  });

  it('should create course Lambda and associate with API and DDB Table', () => {
    createCourseCDK(stack, api);

    const mockCourseTable =
      courseTableModule.courseTable as jest.MockedFunction<
        typeof courseTableModule.courseTable
      >;

    expect(mockCourseTable).toHaveBeenCalledWith(stack);

    const mockTable = mockCourseTable.mock.results[0].value;
    expect(mockTable.grantReadWriteData).toHaveBeenCalled();
    expect(graphqlResolverModule.createGraphqlResolver).toHaveBeenCalled();
  });
});
