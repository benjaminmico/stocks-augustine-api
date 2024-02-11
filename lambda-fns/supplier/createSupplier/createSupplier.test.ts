import { DynamoDB } from 'aws-sdk';
import createSupplier from './createSupplier';
import { Supplier, SupplierInput } from 'types/graphql-types';

const putSpy = jest.spyOn(DynamoDB.DocumentClient.prototype, 'put');

describe('createSupplier', () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation();
    process.env.SUPPLIER_TABLE = 'TestSupplierTable';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const validSupplierInput: SupplierInput = {
    name: 'Test Supplier',
  };

  it('should successfully create a supplier with valid input', async () => {
    const supplierInput = { ...validSupplierInput };

    putSpy.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    } as any);

    const result = await createSupplier(supplierInput as unknown as Supplier);

    expect(putSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        `Supplier created with ID: ${result?.supplierId}`,
      ),
    );
    expect(result).toMatchObject(supplierInput);
  });
});
