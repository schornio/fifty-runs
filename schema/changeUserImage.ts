import { z } from 'zod';

const FILE_SIZE_LIMIT = 1024 * 1024 * 2; // 2 MB

export const changeUserImageSchema = z.object({
  image: z
    .instanceof(Blob, { message: 'Keine gültige Bild-Datei' })
    .refine(
      (data) => {
        return data.size < FILE_SIZE_LIMIT;
      },
      { message: 'Bild zu groß' }
    )
    .optional(),
});
