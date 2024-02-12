import grantUserRestaurantAccess from './grantUserRestaurantAccess';

// Directly mock the instances created by the constructors
const mockPut = jest
  .fn()
  .mockReturnValue({ promise: jest.fn().mockResolvedValue({}) });
const mockAdminUpdateUserAttributes = jest
  .fn()
  .mockReturnValue({ promise: jest.fn().mockResolvedValue({}) });

jest.mock('aws-sdk', () => {
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => ({
        put: mockPut,
      })),
    },
    CognitoIdentityServiceProvider: jest.fn(() => ({
      adminUpdateUserAttributes: mockAdminUpdateUserAttributes,
    })),
  };
});

describe('grantUserRestaurantAccess', () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation();
    process.env.USER_RESTAURANT_ACCESS_TABLE = 'TestUserRestaurantAccessTable';
    process.env.COGNITO_USER_POOL_ID = 'TestUserPoolId';
    jest.clearAllMocks(); // Clear mocks in beforeEach to ensure clean state
  });

  const testUserId = 'test-user-id';
  const testRestaurantId = 'test-restaurant-id';

  it('should successfully grant restaurant access to user and update Cognito user attributes', async () => {
    const result = await grantUserRestaurantAccess(
      testUserId,
      testRestaurantId,
    );

    // Check if the DynamoDB put operation was called
    expect(mockPut).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        `Access granted to userId: ${testUserId} for restaurantId: ${testRestaurantId}`,
      ),
    );

    // Check if the Cognito adminUpdateUserAttributes operation was called
    expect(mockAdminUpdateUserAttributes).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        `Cognito user attributes updated for userId: ${testUserId}`,
      ),
    );

    // Check the function result
    expect(result).toMatchObject({
      userId: testUserId,
      restaurantId: testRestaurantId,
    });
  });
});
