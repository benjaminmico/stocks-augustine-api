import { getDataSourceName } from 'utils/getDataSourceName';

describe('getDataSourceName', () => {
  it('should convert camelCase to PascalCase and append LambdaDataSource', () => {
    expect(getDataSourceName('camelCase')).toBe('CamelCaseLambdaDataSource');
  });

  it('should handle single character strings', () => {
    expect(getDataSourceName('a')).toBe('ALambdaDataSource');
  });

  it('should handle empty strings', () => {
    expect(getDataSourceName('')).toBe('LambdaDataSource');
  });

  it('should handle strings with spaces', () => {
    expect(getDataSourceName('camel Case')).toBe('Camel CaseLambdaDataSource');
  });

  it('should handle non-alphabetic characters', () => {
    expect(getDataSourceName('camelCase123')).toBe(
      'CamelCase123LambdaDataSource',
    );
  });
});
