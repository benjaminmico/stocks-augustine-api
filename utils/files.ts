import { ReadStream } from 'fs';

interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => ReadStream;
}

async function processUpload(upload: FileUpload) {
  const { createReadStream, filename, mimetype } = upload;

  // In the main part of the function
  if (!isValidFile(mimetype)) {
    throw new Error('Invalid file type or size');
  }

  // Handle the file stream
  const stream = createReadStream();

  // Here you can process the stream, e.g., save it to a temp location, or directly stream it to S3

  // Return relevant file information for further processing
  return {
    stream,
    filename,
    mimetype,
  };
}

function isValidFile(mimetype: string): boolean {
  // Example validation logic
  const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  return allowedMimeTypes.includes(mimetype);
}

export { processUpload };
