import { DynamoDB } from 'aws-sdk';
import deleteProduct from './deleteProduct';

const deleteSpy = jest.spyOn(DynamoDB.DocumentClient.prototype, 'delete');

describe('deleteProduct', () => {
  let logSpy: jest.SpyInstance;
  let logErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation();
    logErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    process.env.PRODUCT_TABLE = 'TestProductTable';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const productId = 'test-product-id';

  it('should successfully delete a product', async () => {
    deleteSpy.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    } as any);

    const result = await deleteProduct(productId);

    expect(deleteSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining(`Product deleted with ID: ${productId}`),
    );
  });
});
