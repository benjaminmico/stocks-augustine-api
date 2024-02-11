import { DynamoDB } from 'aws-sdk';
import updateProduct from './updateProduct';
import {
  UpdateProductInput,
  SaleFormat,
  UnitOfMeasure,
} from 'types/graphql-types';

const updateSpy = jest.spyOn(DynamoDB.DocumentClient.prototype, 'update');

describe('updateProduct', () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation();
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
    updateSpy.mockReturnValue({
      promise: jest
        .fn()
        .mockResolvedValue({ Attributes: validUpdateProductInput }),
    } as any);

    const result = await updateProduct(validUpdateProductInput);

    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: 'TestProductTable',
        Key: { productId: validUpdateProductInput.productId },
        UpdateExpression: expect.stringContaining('set #name = :name'),
        ExpressionAttributeNames: expect.objectContaining({
          '#name': 'name',
        }),
        ExpressionAttributeValues: expect.objectContaining({
          ':name': validUpdateProductInput.name,
        }),
        ReturnValues: 'ALL_NEW',
      }),
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        `Product updated with ID: ${validUpdateProductInput.productId}`,
      ),
    );
    expect(result).toMatchObject(validUpdateProductInput);
  });
});
