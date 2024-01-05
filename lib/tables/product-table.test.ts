import { Stack } from 'aws-cdk-lib';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import { productTable } from './product-table';

jest.mock('aws-cdk-lib/aws-dynamodb');

describe('Product Table', () => {
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
    const table = productTable(stack);

    expect(ddb.Table).toHaveBeenCalledWith(
      stack,
      'ProductTable',
      expect.objectContaining({
        billingMode: ddb.BillingMode.PAY_PER_REQUEST,
        partitionKey: {
          name: 'id',
          type: ddb.AttributeType.STRING,
        },
      }),
    );
  });
});
