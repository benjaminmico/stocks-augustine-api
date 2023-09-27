import { DynamoDB } from 'aws-sdk';
import { log, logError } from 'utils/logger';
import { v4 as uuid } from 'uuid';

const docClient = new DynamoDB.DocumentClient();

const createCourse = async (course: any) => {
  if (!course.id) {
    course.id = uuid();
  }

  const params = {
    TableName: process.env.COURSE_TABLE as string,
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
