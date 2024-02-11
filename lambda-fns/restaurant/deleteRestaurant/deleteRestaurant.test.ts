import { DynamoDB } from 'aws-sdk';
import deleteRestaurant from './deleteRestaurant';

const deleteSpy = jest.spyOn(DynamoDB.DocumentClient.prototype, 'delete');

describe('deleteRestaurant', () => {
  beforeEach(() => {
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

    deleteRestaurant(restaurantId);

    expect(deleteSpy).toHaveBeenCalled();
  });
});
