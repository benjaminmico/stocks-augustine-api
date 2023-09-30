import { DynamoDB } from 'aws-sdk';
import { getDynamoConfig } from 'config/dynamoConfig';
import { Course } from 'types/graphql-types';
import { log, logError } from 'utils/logger';
import { v4 as uuid } from 'uuid';

const createCourse = async (course: Course) => {
  const env = process.env.AWS_ENV;

  const docClient = new DynamoDB.DocumentClient({
    ...getDynamoConfig(env),
    params: {
      TableName: 'TestCourseTable' as string,
    },
  });

  if (!course.id) {
    course.id = uuid();
  }

  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: 'TestCourseTable' as string,
    Item: course,
  };
  try {
    await docClient.put(params).promise();
    log({ message: `Course created with id: ${course.id}` });
    return course;
  } catch (err) {
    logError({ message: 'DynamoDB error:', error: err });
    return null;
  }
};

export default createCourse;
