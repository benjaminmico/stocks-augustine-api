const AWS = require('aws-sdk');
import getRestaurants from './getRestaurants';
import {
  RestaurantInput,
  SaleFormat,
  UnitOfMeasure,
} from 'types/graphql-types';

const dynamoDB = new AWS.DynamoDB({
  region: 'local',
  endpoint: 'http://localhost:8000',
});

const docClient = new AWS.DynamoDB.DocumentClient({
  region: 'local',
  endpoint: 'http://localhost:8000',
});

const testTableName = 'RESTAURANT_TABLE';
process.env.AWS_ENV = 'LOCAL';
process.env.RESTAURANT_TABLE = testTableName;

describe('getRestaurants Integration Test', () => {
  beforeAll(async () => {
    await dynamoDB
      .createTable({
        TableName: testTableName,
        KeySchema: [{ AttributeName: 'restaurantId', KeyType: 'HASH' }],
        AttributeDefinitions: [
          { AttributeName: 'restaurantId', AttributeType: 'S' },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      })
      .promise();

    await dynamoDB
      .waitFor('tableExists', { TableName: testTableName })
      .promise();

    const testRestaurants = [
      {
        restaurantId: 'prod-1',
        name: 'Restaurant 1',
        unit: 10,
        saleFormat: SaleFormat.Individual,
        price: 19.99,
        unitOfMeasure: UnitOfMeasure.Unit,
        supplierId: 'supplier123',
      },
      {
        restaurantId: 'prod-2',
        name: 'Restaurant 2',
        unit: 5,
        saleFormat: SaleFormat.Package,
        price: 29.99,
        unitOfMeasure: UnitOfMeasure.Kilogram,
        supplierId: 'supplier456',
      },
    ];

    for (const restaurant of testRestaurants) {
      await docClient
        .put({
          TableName: testTableName,
          Item: restaurant,
        })
        .promise();
    }
  }, 30000);

  afterAll(async () => {
    await dynamoDB.deleteTable({ TableName: testTableName }).promise();
    await dynamoDB
      .waitFor('tableNotExists', { TableName: testTableName })
      .promise();
  });

  it('should retrieve restaurants from DynamoDB', async () => {
    const result = await getRestaurants(null, null, 10, null);

    expect(result?.length).toBeGreaterThanOrEqual(2);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          restaurantId: 'prod-1',
          name: 'Restaurant 1',
        }),
        expect.objectContaining({
          restaurantId: 'prod-2',
          name: 'Restaurant 2',
        }),
      ]),
    );
  });
});
