import { S3 } from 'aws-sdk';
import { processUpload } from 'utils/files';
import { log, logError } from 'utils/logger';
import scanInvoice from './scanInvoice'; // Adjust the import path as necessary
import { v4 as uuid } from 'uuid';

jest.mock('utils/files', () => ({
  processUpload: jest.fn(),
}));

jest.mock('utils/logger', () => ({
  log: jest.fn(),
  logError: jest.fn(),
}));

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('uuid'),
}));

describe('scanInvoice', () => {
  const mockFile = {
    filename: 'invoice.pdf',
    mimetype: 'application/pdf',
    createReadStream: jest.fn(),
  };

  const mockBucketName = 'test-bucket';
  process.env.INVOICE_BUCKET_NAME = mockBucketName;

  let uploadSpy: jest.SpyInstance;

  beforeEach(() => {
    uploadSpy = jest.spyOn(S3.prototype, 'upload');
    uploadSpy.mockImplementation(() => ({
      promise: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully upload a file to S3 and return the location', async () => {
    const mockLocation = 'http://example.com/invoice.pdf';
    uploadSpy.mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue({ Location: mockLocation }),
    }));
    (processUpload as jest.Mock).mockResolvedValueOnce(
      mockFile.createReadStream(),
    );

    const result = await scanInvoice({ file: mockFile });

    expect(uploadSpy).toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith({
      message: `Invoice uploaded to S3 at location: ${mockLocation}`,
    });
    expect(result).toBe(mockLocation);
  });

  it('should return null and log an error if the upload fails', async () => {
    const mockError = new Error('Upload failed');
    uploadSpy.mockImplementation(() => ({
      promise: jest.fn().mockRejectedValue(mockError),
    }));
    (processUpload as jest.Mock).mockResolvedValueOnce(
      mockFile.createReadStream(),
    );

    const result = await scanInvoice({ file: mockFile });

    expect(uploadSpy).toHaveBeenCalled();
    expect(logError).toHaveBeenCalledWith({
      message: 'Error uploading invoice:',
      error: mockError,
    });
    expect(result).toBeNull();
  });
});
