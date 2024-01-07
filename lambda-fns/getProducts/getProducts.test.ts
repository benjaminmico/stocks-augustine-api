import { DynamoDB } from 'aws-sdk';
import getProducts from './getProducts';
import {
  Product,
  FilterInput,
  SortInput,
  SaleFormat,
  UnitOfMeasure,
} from 'types/graphql-types';

const mockProducts: Product[] = [
  {
    productId: 'prod-1',
    name: 'Product 1',
    packageWeight: 1.2,
    saleFormat: SaleFormat.Individual,
    price: 10.99,
    supplierId: 'supplier-1',
    unitOfMeasure: UnitOfMeasure.Unit,
  },
  {
    productId: 'prod-2',
    name: 'Product 2',
    packageWeight: 2.5,
    saleFormat: SaleFormat.Package,
    price: 20.99,
    supplierId: 'supplier-2',
    unitOfMeasure: UnitOfMeasure.Kilogram,
  },
];

const scanSpy = jest.spyOn(DynamoDB.DocumentClient.prototype, 'scan');
const querySpy = jest.spyOn(DynamoDB.DocumentClient.prototype, 'query'); // If you use query in your implementation

describe('getProducts', () => {
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

  it('should successfully retrieve products', async () => {
    scanSpy.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Items: mockProducts }),
    } as any);

    const result = await getProducts(null, null, 10, null);

    expect(scanSpy).toHaveBeenCalled();
    expect(result?.items).toEqual(mockProducts);
    expect(result?.nextToken).toBeNull();
  });

  it('should handle filtering', async () => {
    const filter: FilterInput = {
      attributeName: 'name',
      attributeValue: 'Test Product',
    };

    scanSpy.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Items: mockProducts }),
    } as any);

    const result = await getProducts(filter, null, 10, null);

    expect(scanSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        FilterExpression: '#attrName = :attrValue',
        ExpressionAttributeNames: {
          '#attrName': filter.attributeName,
        },
        ExpressionAttributeValues: {
          ':attrValue': filter.attributeValue,
        },
      }),
    );
    expect(result?.items).toEqual(mockProducts);
  });
});
