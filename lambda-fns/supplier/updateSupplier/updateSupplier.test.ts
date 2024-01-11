import { DynamoDB } from 'aws-sdk';
import updateSupplier from './updateSupplier';
import {
  UpdateSupplierInput,
  SaleFormat,
  UnitOfMeasure,
} from 'types/graphql-types';

const updateSpy = jest.spyOn(DynamoDB.DocumentClient.prototype, 'update');

describe('updateSupplier', () => {
  let logSpy: jest.SpyInstance;
  let logErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation();
    logErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    process.env.SUPPLIER_TABLE = 'TestSupplierTable';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const validUpdateSupplierInput: UpdateSupplierInput = {
    supplierId: '123',
    name: 'Updated Test Supplier',
  };

  it('should successfully update a supplier with valid input', async () => {
    updateSpy.mockReturnValue({
      promise: jest
        .fn()
        .mockResolvedValue({ Attributes: validUpdateSupplierInput }),
    } as any);

    const result = await updateSupplier(validUpdateSupplierInput);

    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: 'TestSupplierTable',
        Key: { supplierId: validUpdateSupplierInput.supplierId },
        UpdateExpression: expect.stringContaining('set #name = :name'),
        ExpressionAttributeNames: expect.objectContaining({
          '#name': 'name',
        }),
        ExpressionAttributeValues: expect.objectContaining({
          ':name': validUpdateSupplierInput.name,
        }),
        ReturnValues: 'ALL_NEW',
      }),
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        `Supplier updated with ID: ${validUpdateSupplierInput.supplierId}`,
      ),
    );
    expect(result).toMatchObject(validUpdateSupplierInput);
  });
});
