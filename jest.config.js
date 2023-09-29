const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  collectCoverageFrom: [
    'lambda-fns/**/*.ts',
    'lib/**/*.ts',
    'utils/**/*.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/*.int.ts',
  ],
  coverageThreshold: {
    global: {
      lines: 100,
    },
  },
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/index.ts$'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
