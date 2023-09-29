import { DynamoDB } from 'aws-sdk';
import createCourse from './createCourse';
import { logError } from 'utils/logger';
import { log } from 'console';
import { Course } from 'types/graphql-types';

// Create a spy on the put method
const putSpy = jest.spyOn(DynamoDB.DocumentClient.prototype, 'put');

describe('createCourse', () => {
  let logSpy: jest.SpyInstance;
  let logErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call DocumentClient put method with correct params', async () => {
    const course = { name: 'Test Course' } as unknown as Course;
    const expectedParams = {
      TableName: 'TestCourseTable',
      Item: expect.objectContaining(course),
    };

    // Setup the spy to successfully resolve the promise
    putSpy.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    } as any);

    const result = await createCourse(course);

    expect(putSpy).toHaveBeenCalledWith(expectedParams);
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining(`Course created with id: ${result?.id}`),
    );
    expect(result).toEqual(course);
  });

  it('should log an error if DocumentClient put method fails', async () => {
    const course = { name: 'Test Course' } as unknown as Course;

    // Setup the spy to reject the promise
    putSpy.mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error('DynamoDB error')),
    } as any);

    const result = await createCourse(course);

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('DynamoDB error:'),
    );
    expect(result).toBeNull();
  });
});
