import { DynamoDB } from 'aws-sdk';
import updateProduct from './updateProduct';

import {
  Product,
  UpdateProductInput,
  SaleFormat,
  UnitOfMeasure,
} from 'types/graphql-types';

const updateSpy = jest.spyOn(DynamoDB.DocumentClient.prototype, 'update');

describe('updateProduct', () => {
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

  const validUpdateProductInput: UpdateProductInput = {
    productId: '123',
    name: 'Updated Test Product',
    unit: 20,
    saleFormat: SaleFormat.Package,
    price: 29.99,
    unitOfMeasure: UnitOfMeasure.Liter,
    supplierId: 'supplier456',
  };

  it('should successfully update a product with valid input', async () => {
    const updateInput = { ...validUpdateProductInput };

    updateSpy.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Attributes: updateInput }),
    } as any);

    const result = await updateProduct(updateInput as unknown as Product);

    expect(updateSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        `Product updated with ID: ${updateInput.productId}`,
      ),
    );
    expect(result).toMatchObject(updateInput);
  });
});
