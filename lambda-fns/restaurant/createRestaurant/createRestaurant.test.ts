import { DynamoDB } from 'aws-sdk';
import createRestaurant from './createRestaurant';

import {
  Restaurant,
  RestaurantInput,
  SaleFormat,
  UnitOfMeasure,
} from 'types/graphql-types';

const putSpy = jest.spyOn(DynamoDB.DocumentClient.prototype, 'put');

describe('createRestaurant', () => {
  let logSpy: jest.SpyInstance;
  let logErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation();
    logErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    process.env.RESTAURANT_TABLE = 'TestRestaurantTable';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const validRestaurantInput: RestaurantInput = {
    name: 'Test Restaurant',
  };

  it('should successfully create a restaurant with valid input', async () => {
    const restaurantInput = { ...validRestaurantInput };

    putSpy.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    } as any);

    const result = await createRestaurant(restaurantInput);

    expect(putSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        `Restaurant created with ID: ${result?.restaurantId}`,
      ),
    );
    expect(result).toMatchObject(restaurantInput);
  });
});
