import { DynamoDB } from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';

export type DynamoDBConfigurationsOptions =
  | (DynamoDB.DocumentClient.DocumentClientOptions &
      ServiceConfigurationOptions &
      DynamoDB.ClientApiVersions)
  | undefined;

const LOCAL: DynamoDBConfigurationsOptions = {
  region: 'local',
  endpoint: 'http://localhost:8000',
};

const DEV: DynamoDBConfigurationsOptions = {};

const STG: DynamoDBConfigurationsOptions = {};

const PRD: DynamoDBConfigurationsOptions = {};

const configMap: Record<string, DynamoDBConfigurationsOptions> = {
  LOCAL,
  DEV,
  STG,
  PRD,
};

export const getDynamoConfig = (env: string): DynamoDBConfigurationsOptions => {
  return configMap[env] || LOCAL;
};
