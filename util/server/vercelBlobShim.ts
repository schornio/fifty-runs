// ToDo: Remove this file when Vercel supports Blob
// See: https://vercel.com/storage/blob "Now available in Private Beta"

import { mkdir, rmdir, writeFile } from 'fs/promises';
import { randomBytes } from 'crypto';

const PUBLIC_FOLDER = './public';

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

  const folderPath = `/upload/${id}`;
  const folderSystemPath = `${PUBLIC_FOLDER}${folderPath}`;
  await mkdir(folderSystemPath);

  const filePath = `${folderPath}/${pathname}`;

  const arrayBuffer = await body.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const fileSystemPath = `${PUBLIC_FOLDER}${filePath}`;
  await writeFile(fileSystemPath, buffer);

  return {
    url: filePath,
  };
}

export async function del(url: string) {
  const folderId = url.split('/')[2];
  const fileSystemPath = `${PUBLIC_FOLDER}/upload/${folderId}`;
  await rmdir(fileSystemPath, { recursive: true });
}
