const { processUpload } = require('./files');
const fs = require('fs');
const path = require('path');

describe('processUpload', () => {
  it('should process valid file uploads correctly', async () => {
    const mockFile = {
      filename: 'test.pdf',
      mimetype: 'application/pdf',
      createReadStream: () =>
        fs.createReadStream(path.join(__dirname, 'test.pdf')),
    };

    const result = await processUpload(mockFile);
    expect(result.filename).toBe('test.pdf');
    expect(result.mimetype).toBe('application/pdf');
    expect(result.stream).toBeDefined();
  });

  it('should reject invalid file types', async () => {
    const mockFile = {
      filename: 'test.exe',
      mimetype: 'application/exe',
      createReadStream: () =>
        fs.createReadStream(path.join(__dirname, 'test.exe')),
    };

    await expect(processUpload(mockFile)).rejects.toThrow(
      'Invalid file type or size',
    );
  });
});
