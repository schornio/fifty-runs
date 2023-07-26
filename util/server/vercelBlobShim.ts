// ToDo: Remove this file when Vercel supports Blob
// See: https://vercel.com/storage/blob "Now available in Private Beta"

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { randomBytes } from 'crypto';

const client = new S3Client({
  credentials: {
    accessKeyId: process.env.SCW_ACCESS_KEY ?? '',
    secretAccessKey: process.env.SCW_SECRET_KEY ?? '',
  },
  endpoint: 'https://s3.fr-par.scw.cloud',
  region: 'fr-par',
});

type BlobResult = {
  url: string;
};

export async function put(
  pathname: string,
  body: Blob,
  // eslint-disable-next-line no-unused-vars
  _options: { access: 'public' }
): Promise<BlobResult> {
  const id = randomBytes(32).toString('hex');

  const folderPath = `upload/${id}`;

  const filePath = `${folderPath}/${pathname}`;

  const arrayBuffer = await body.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const putObjectCommand = new PutObjectCommand({
    Body: buffer,
    Bucket: process.env.SCW_BUCKET_NAME ?? '',
    Key: filePath,
  });

  await client.send(putObjectCommand);

  return {
    url: `https://fifty-runs-files.s3.fr-par.scw.cloud/${filePath}`,
  };
}

export async function del(url: string) {
  const deleteObjectCommand = new DeleteObjectCommand({
    Bucket: process.env.SCW_BUCKET_NAME ?? '',
    Key: url.replace('https://fifty-runs-files.s3.fr-par.scw.cloud/', ''),
  });
  await client.send(deleteObjectCommand);
}
