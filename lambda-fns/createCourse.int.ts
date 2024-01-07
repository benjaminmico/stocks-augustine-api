import { Course } from 'types/graphql-types';
import createCourse from './createCourse';
const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB({
  region: 'local', // Use 'local' region for local DynamoDB
  endpoint: 'http://localhost:8000', // Point to local DynamoDB instance
});

const testTableName = 'COURSE_TABLE';
process.env.AWS_ENV = 'LOCAL';
process.env.COURSE_TABLE = testTableName;

describe('createCourse Integration Test', () => {
  beforeAll(async () => {
    // Create the table
    await dynamoDB
      .createTable({
        TableName: testTableName,
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
        AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      })
      .promise();

    // Wait for the table to be created
    await dynamoDB
      .waitFor('tableExists', { TableName: testTableName })
      .promise();

    // List all tables
    dynamoDB.listTables({}, (err: any, data: any) => {
      if (err) {
        console.error('Unable to list tables', JSON.stringify(err, null, 2));
      } else {
        console.log('Tables', JSON.stringify(data.TableNames));
      }
    });
    // Log that the table has been created
    console.log(`Table ${testTableName} has been created.`);
  }, 30000);

  afterAll(async () => {
    // Delete the table
    await dynamoDB.deleteTable({ TableName: testTableName }).promise();
    await dynamoDB
      .waitFor('tableNotExists', { TableName: testTableName })
      .promise();
  });

  it('should create a course in DynamoDB', async () => {
    const course = { name: 'Integration Test Course' };

    // Call the createCourse function
    const result = await createCourse(course as unknown as Course);

    // Check that the returned result is correct
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name', course.name);

    // Query the local DynamoDB to ensure the course was written correctly
    const response = await dynamoDB
      .getItem({
        TableName: testTableName,
        Key: {
          id: { S: result?.id },
        },
      })
      .promise();

    // Transform the DynamoDB response to a simpler structure
    const transformedResponse = {
      id: response.Item.id.S,
      name: response.Item.name.S,
    };

    expect(transformedResponse).toEqual(result);
  });
});
