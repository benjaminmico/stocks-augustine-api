import { getDynamoConfig } from './dynamoConfig';

describe('DynamoDB Configurations', () => {
  test('should return LOCAL configuration for "LOCAL" input', () => {
    const config = getDynamoConfig('LOCAL');
    expect(config).toEqual({
      region: 'local',
      endpoint: 'http://localhost:8000',
    });
  });

  test('should return DEV configuration for "DEV" input', () => {
    const config = getDynamoConfig('DEV');
    expect(config).toEqual({});
  });

  test('should return STG configuration for "STG" input', () => {
    const config = getDynamoConfig('STG');
    expect(config).toEqual({});
  });

  test('should return PRD configuration for "PRD" input', () => {
    const config = getDynamoConfig('PRD');
    expect(config).toEqual({});
  });

  test('should return empty configuration for unknown environment input', () => {
    const config = getDynamoConfig('UNKNOWN');
    expect(config).toEqual({});
  });
});
