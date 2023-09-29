export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

export interface Logger {
  level?: LogLevel;
  message: Error | string;
  error?: unknown;
  [key: string]: unknown;
}

export const log = ({ level = LogLevel.INFO, message, ...rest }: Logger) => {
  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      ...rest,
    }),
  );
};
export const logError = ({
  level = LogLevel.ERROR,
  message,
  ...rest
}: Logger) => {
  const errorString = message instanceof Error ? message.toString() : message;

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message: errorString,
      ...rest,
    }),
  );
};
