// FROM: https://stackoverflow.com/a/74827975
export async function resizeImage(
  image: File,
  target: { width: number; height: number }
) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not create canvas context');
  }

  canvas.width = target.width;
  canvas.height = target.height;

  const bitmap = await createImageBitmap(image);

  const ratio = Math.max(
    target.width / bitmap.width,
    target.height / bitmap.height
  );

  const x = (target.width - bitmap.width * ratio) / 2;
  const y = (target.height - bitmap.height * ratio) / 2;

  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(
    bitmap,
    0,
    0,
    bitmap.width,
    bitmap.height,
    x,
    y,
    bitmap.width * ratio,
    bitmap.height * ratio
  );

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const resizedFile = new File([blob], image.name, {
            type: 'image/jpeg',
          });
          resolve(resizedFile);
        }
        reject(new Error('Could not resize image'));
      },
      'image/jpeg',
      1
    );
  });
}
