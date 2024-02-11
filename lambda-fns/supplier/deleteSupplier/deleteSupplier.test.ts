import { DynamoDB } from 'aws-sdk';

const deleteSpy = jest.spyOn(DynamoDB.DocumentClient.prototype, 'delete');

describe('deleteSupplier', () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation();
    process.env.SUPPLIER_TABLE = 'TestSupplierTable';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const supplierId = 'test-supplier-id';

  it('should successfully delete a supplier', async () => {
    deleteSpy.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    } as any);

    expect(deleteSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining(`Supplier deleted with ID: ${supplierId}`),
    );
  });
});
