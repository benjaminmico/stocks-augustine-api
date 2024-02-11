import { DynamoDB } from 'aws-sdk';
import getRestaurants from './getRestaurants';
import { Restaurant, FilterInput } from 'types/graphql-types';

const mockRestaurants: Restaurant[] = [
  {
    restaurantId: 'prod-1',
    name: 'Restaurant 1',
  },
  {
    restaurantId: 'prod-2',
    name: 'Restaurant 2',
  },
];

const scanSpy = jest.spyOn(DynamoDB.DocumentClient.prototype, 'scan');

describe('getRestaurants', () => {
  beforeEach(() => {
    process.env.RESTAURANT_TABLE = 'TestRestaurantTable';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully retrieve restaurants', async () => {
    scanSpy.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Items: mockRestaurants }),
    } as any);

    const result = await getRestaurants(null, null, 10, null);

    expect(scanSpy).toHaveBeenCalled();
    expect(result).toEqual(mockRestaurants);
  });

  it('should handle filtering', async () => {
    const filter: FilterInput = {
      attributeName: 'name',
      attributeValue: 'Test Restaurant',
    };

    scanSpy.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Items: mockRestaurants }),
    } as any);

    const result = await getRestaurants(filter, null, 10, null);

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
    expect(result).toEqual(mockRestaurants);
  });
});
