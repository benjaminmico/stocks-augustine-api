import { DynamoDB } from 'aws-sdk';
import updateRestaurant from './updateRestaurant';
import { UpdateRestaurantInput } from 'types/graphql-types';

const updateSpy = jest.spyOn(DynamoDB.DocumentClient.prototype, 'update');

describe('updateRestaurant', () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation();
    process.env.RESTAURANT_TABLE = 'TestRestaurantTable';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const validUpdateRestaurantInput: UpdateRestaurantInput = {
    restaurantId: '123',
    name: 'Updated Test Restaurant',
  };

  it('should successfully update a restaurant with valid input', async () => {
    updateSpy.mockReturnValue({
      promise: jest
        .fn()
        .mockResolvedValue({ Attributes: validUpdateRestaurantInput }),
    } as any);

    const result = await updateRestaurant(validUpdateRestaurantInput);

    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: 'TestRestaurantTable',
        Key: { restaurantId: validUpdateRestaurantInput.restaurantId },
        UpdateExpression: expect.stringContaining('set #name = :name'),
        ExpressionAttributeNames: expect.objectContaining({
          '#name': 'name',
        }),
        ExpressionAttributeValues: expect.objectContaining({
          ':name': validUpdateRestaurantInput.name,
        }),
        ReturnValues: 'ALL_NEW',
      }),
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        `Restaurant updated with ID: ${validUpdateRestaurantInput.restaurantId}`,
      ),
    );
    expect(result).toMatchObject(validUpdateRestaurantInput);
  });
});
