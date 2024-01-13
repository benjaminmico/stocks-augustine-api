import { S3 } from 'aws-sdk';
import { processUpload } from 'utils/files';
import { log, logError } from 'utils/logger';
import { v4 as uuid } from 'uuid';

interface ScanInvoiceInput {
  file: any;
}

const scanInvoice = async (scanInvoiceInput: ScanInvoiceInput) => {
  const s3 = new S3();
  const bucketName = process.env.INVOICE_BUCKET_NAME as string;

  try {
    const file = scanInvoiceInput.file;
    const stream = await processUpload(file);

    // Generate a unique file name, for instance using UUID
    const fileName = `${uuid()}-${file.filename}`;

    // Upload file to S3
    const { Location } = await s3
      .upload({
        Bucket: bucketName,
        Key: fileName,
        Body: stream,
        ContentType: file.mimetype,
      })
      .promise();

    log({ message: `Invoice uploaded to S3 at location: ${Location}` });
    return Location; // Return the URL of the uploaded file
  } catch (err) {
    logError({ message: 'Error uploading invoice:', error: err });
    return null;
  }
};

export default scanInvoice;
