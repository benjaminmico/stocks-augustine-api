import { DynamoDB } from 'aws-sdk';
import { getDynamoConfig } from 'config/dynamoConfig';
import { Course } from 'types/graphql-types';
import { log, logError } from 'utils/logger';
import { v4 as uuid } from 'uuid';

const env = process.env.NODE_ENV || 'LOCAL';
const config = getDynamoConfig(env);

const docClient = new DynamoDB.DocumentClient({
  ...getDynamoConfig(env),
  params: {
    TableName: process.env.COURSE_TABLE as string,
  },
});

const createCourse = async (course: Course) => {
  if (!course.id) {
    course.id = uuid();
  }

  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: 'TestCourseTable',
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
