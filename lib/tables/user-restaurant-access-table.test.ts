import { Stack } from 'aws-cdk-lib';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import { userRestaurantAccessTable } from './user-restaurant-access-table';

jest.mock('aws-cdk-lib/aws-dynamodb');

describe('User Restaurant Access Table', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();

    // Resetting mocks to clear any previous call information
    jest.clearAllMocks();

    // Mocking the Table constructor
    (ddb.Table as jest.MockedClass<typeof ddb.Table>).mockImplementation(
      () =>
        ({
          // Mocking any needed properties or methods here, if necessary
        }) as unknown as ddb.Table,
    );
  });

  it('should create a DynamoDB table with correct properties, including partition and sort keys', () => {
    userRestaurantAccessTable(stack);

    expect(ddb.Table).toHaveBeenCalledWith(
      stack,
      'UserRestaurantAccessTable',
      expect.objectContaining({
        billingMode: ddb.BillingMode.PAY_PER_REQUEST,
        partitionKey: {
          name: 'userId',
          type: ddb.AttributeType.STRING,
        },
        sortKey: {
          // This checks for the sort key property
          name: 'restaurantId',
          type: ddb.AttributeType.STRING,
        },
      }),
    );
  });
});
