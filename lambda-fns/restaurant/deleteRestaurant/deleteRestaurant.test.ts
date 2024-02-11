import { DynamoDB } from 'aws-sdk';

const deleteSpy = jest.spyOn(DynamoDB.DocumentClient.prototype, 'delete');

describe('deleteRestaurant', () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation();
    process.env.RESTAURANT_TABLE = 'TestRestaurantTable';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const restaurantId = 'test-restaurant-id';

  it('should successfully delete a restaurant', async () => {
    deleteSpy.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    } as any);

    expect(deleteSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining(`Restaurant deleted with ID: ${restaurantId}`),
    );
  });
});
