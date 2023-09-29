import { log, logError, LogLevel } from './logger'; // Adjust the import path accordingly

describe('Logger', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('log function', () => {
    it('should log the message with INFO level by default', () => {
      const message = 'Test log message';
      log({ message });

      const loggedMessage = JSON.parse(
        (console.log as jest.Mock).mock.calls[0][0],
      );

      expect(loggedMessage.level).toBe(LogLevel.INFO);
      expect(loggedMessage.message).toBe(message);
      expect(loggedMessage.timestamp).toBeDefined();
    });

    it('should log the message with specified log level', () => {
      const message = 'Test log message';
      const level = LogLevel.ERROR;
      log({ level, message });

      const loggedMessage = JSON.parse(consoleSpy.mock.calls[0][0]);

      expect(loggedMessage.level).toBe(level);
      expect(loggedMessage.message).toBe(message);
    });

    it('should include additional properties in the log', () => {
      const message = 'Test log message';
      const additionalProperties = { prop1: 'value1', prop2: 'value2' };
      log({ message, ...additionalProperties });

      const loggedMessage = JSON.parse(
        (console.log as jest.Mock).mock.calls[0][0],
      );

      expect(loggedMessage).toMatchObject(additionalProperties);
    });

    it('should not log error by default', () => {
      const message = 'Test log message';
      log({ message });

      const loggedMessage = JSON.parse(
        (console.log as jest.Mock).mock.calls[0][0],
      );

      expect(loggedMessage.error).toBeUndefined();
    });
  });

  describe('logError function', () => {
    it('should log the message with ERROR level by default', () => {
      const message = 'Test error message';
      logError({ message });

      const loggedMessage = JSON.parse(
        (console.log as jest.Mock).mock.calls[0][0],
      );

      expect(loggedMessage.level).toBe(LogLevel.ERROR);
      expect(loggedMessage.message).toBe(message);
      expect(loggedMessage.timestamp).toBeDefined();
    });

    it('should include error object if provided', () => {
      const message = new Error('Test error');
      logError({ message });

      const loggedMessage = JSON.parse(
        (console.log as jest.Mock).mock.calls[0][0],
      );

      expect(loggedMessage.message).toBe(message.toString());
    });

    it('should include additional properties in the log', () => {
      const message = 'Test error message';
      const additionalProperties = { prop1: 'value1', prop2: 'value2' };
      logError({ message, ...additionalProperties });

      const loggedMessage = JSON.parse(
        (console.log as jest.Mock).mock.calls[0][0],
      );

      expect(loggedMessage).toMatchObject(additionalProperties);
    });
  });
});
