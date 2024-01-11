import { Stack } from 'aws-cdk-lib';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import { supplierTable } from './supplier-table';

jest.mock('aws-cdk-lib/aws-dynamodb');

describe('Supplier Table', () => {
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
    const table = supplierTable(stack);

    expect(ddb.Table).toHaveBeenCalledWith(
      stack,
      'SupplierTable',
      expect.objectContaining({
        billingMode: ddb.BillingMode.PAY_PER_REQUEST,
        partitionKey: {
          name: 'supplierId',
          type: ddb.AttributeType.STRING,
        },
      }),
    );
  });
});
