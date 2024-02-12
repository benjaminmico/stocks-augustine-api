import { Stack } from 'aws-cdk-lib';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import { menuItemTable } from './menu-item-table';

jest.mock('aws-cdk-lib/aws-dynamodb');

describe('Menu Item Table', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();

    // Mocking the Table constructor
    (ddb.Table as jest.MockedClass<typeof ddb.Table>).mockImplementation(
      () =>
        ({
          // Mocking any needed properties or methods here
        }) as unknown as ddb.Table,
    );
  });

  it('should create a DynamoDB table with correct properties', () => {
    menuItemTable(stack);

    expect(ddb.Table).toHaveBeenCalledWith(
      stack,
      'MenuItemTable',
      expect.objectContaining({
        billingMode: ddb.BillingMode.PAY_PER_REQUEST,
        partitionKey: {
          name: 'menuItemId',
          type: ddb.AttributeType.STRING,
        },
      }),
    );
  });
});
