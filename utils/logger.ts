enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

interface Logger {
  level?: LogLevel;
  message: string;
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
