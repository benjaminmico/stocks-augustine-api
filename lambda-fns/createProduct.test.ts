import { DynamoDB } from 'aws-sdk';
import createProduct from './createProduct';
import { logError } from 'utils/logger';
import { log } from 'console';
import {
  Product,
  ProductInput,
  SaleFormat,
  UnitOfMeasure,
} from 'types/graphql-types';

const putSpy = jest.spyOn(DynamoDB.DocumentClient.prototype, 'put');

describe('createProduct', () => {
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

  const validProductInput: ProductInput = {
    name: 'Test Product',
    unit: 10,
    saleFormat: SaleFormat.Individual,
    price: 19.99,
    unitOfMeasure: UnitOfMeasure.Unit,
    supplierId: 'supplier123',
  };

  it('should successfully create a product with valid input', async () => {
    const productInput = { ...validProductInput };

    putSpy.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    } as any);

    const result = await createProduct(productInput as unknown as Product);

    expect(putSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining(`Product created with ID: ${result?.productId}`),
    );
    expect(result).toMatchObject(productInput);
  });
});
