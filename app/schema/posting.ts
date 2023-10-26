import { z } from 'zod';

const FILE_SIZE_LIMIT = 1024 * 1024 * 2; // 2 MB

export const postingSchemaBase = z.object({
  image: z
    .instanceof(Blob, { message: 'Keine gültige Bild-Datei' })
    .refine((data) => data.size < FILE_SIZE_LIMIT, {
      message: 'Bild zu groß',
    })
    .optional(),
  text: z.string().optional(),
  visibility: z.enum(['public', 'protected', 'private']),
});

export const postingSchema = postingSchemaBase
  .extend({
    type: z.literal('posting'),
  })
  .refine((data) => !(data.image?.size === 0 && !data.text), {
    message: 'Es muss ein Bild oder Text angegeben werden',
    path: [''],
  });
