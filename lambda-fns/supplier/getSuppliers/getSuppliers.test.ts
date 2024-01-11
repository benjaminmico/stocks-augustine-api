import { DynamoDB } from 'aws-sdk';
import getSuppliers from './getSuppliers';
import {
  Supplier,
  FilterInput,
  SortInput,
  SaleFormat,
  UnitOfMeasure,
} from 'types/graphql-types';

const mockSuppliers: Supplier[] = [
  {
    supplierId: 'prod-1',
    name: 'Supplier 1',
  },
  {
    supplierId: 'prod-2',
    name: 'Supplier 2',
  },
];

const scanSpy = jest.spyOn(DynamoDB.DocumentClient.prototype, 'scan');
const querySpy = jest.spyOn(DynamoDB.DocumentClient.prototype, 'query'); // If you use query in your implementation

describe('getSuppliers', () => {
  let logSpy: jest.SpyInstance;
  let logErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation();
    logErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    process.env.PRODUCT_TABLE = 'TestSupplierTable';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully retrieve suppliers', async () => {
    scanSpy.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Items: mockSuppliers }),
    } as any);

    const result = await getSuppliers(null, null, 10, null);

    expect(scanSpy).toHaveBeenCalled();
    expect(result).toEqual(mockSuppliers);
  });

  it('should handle filtering', async () => {
    const filter: FilterInput = {
      attributeName: 'name',
      attributeValue: 'Test Supplier',
    };

    scanSpy.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Items: mockSuppliers }),
    } as any);

    const result = await getSuppliers(filter, null, 10, null);

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
    expect(result).toEqual(mockSuppliers);
  });
});
