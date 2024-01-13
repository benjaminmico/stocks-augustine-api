import { DynamoDB } from 'aws-sdk';
import createProduct from './createProduct';

import {
  Product,
  ProductInput,
  SaleFormat,
  UnitOfMeasure,
} from 'types/graphql-types';
import { doesDynamoDBEntryExist } from 'utils/dynamodb';

jest.mock('utils/dynamodb', () => ({
  doesDynamoDBEntryExist: jest.fn(),
}));

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
    restaurantId: 'restaurant123',
  };

  it('should successfully create a product with valid input', async () => {
    const productInput = { ...validProductInput };

    // Mock the behavior of doesDynamoDBEntryExist
    (doesDynamoDBEntryExist as jest.MockedFunction<any>).mockResolvedValue(
      true,
    );

    putSpy.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    } as any);

    const result = await createProduct(productInput);

    expect(putSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining(`Product created with ID: ${result?.productId}`),
    );
    expect(result).toMatchObject(productInput);
  });
});
