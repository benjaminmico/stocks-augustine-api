import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

const getUploadUrl = async (userId: string) => {
  if (!process.env?.BUCKET) return;

  const s3 = new S3Client();
  const key = crypto.randomUUID();
  const data = await createPresignedPost(s3, {
    Bucket: process.env.BUCKET,
    Key: 'staging/' + key,
    Fields: {
      'x-amz-meta-userid': userId,
      'x-amz-meta-key': key,
    },
    Conditions: [
      ['content-length-range', 0, 10000000], // content length restrictions: 0-10MB
      ['starts-with', '$Content-Type', 'application/pdf'], // content type restriction
      ['eq', '$x-amz-meta-userid', userId], // tag with userid <= the user can see this!
      ['eq', '$x-amz-meta-key', key],
    ],
  });
  return { data };
};

export default getUploadUrl;
