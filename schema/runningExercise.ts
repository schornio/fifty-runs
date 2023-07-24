import { coerce, object, string, z } from 'zod';

const FILE_SIZE_LIMIT = 1024 * 1024 * 2; // 2 MB

export const runningExperciseSchema = object({
  distanceKilometers: coerce
    .number()
    .int('Distanz in Kilometern muss eine ganze Zahl sein')
    .default(0),
  distanceMeters: coerce
    .number()
    .int('Distanz in Metern muss eine ganze Zahl sein')
    .default(0),
  durationHours: coerce
    .number()
    .int('Stunden muss eine ganze Zahl sein')
    .default(0),
  durationMinutes: coerce
    .number()
    .int('Minuten muss eine ganze Zahl sein')
    .default(0),
  durationSeconds: coerce
    .number()
    .int('Sekunden muss eine ganze Zahl sein')
    .default(0),
  image: z
    .instanceof(Blob, { message: 'Keine gültige Bild-Datei' })
    .refine((data) => data.size < FILE_SIZE_LIMIT, { message: 'Bild zu groß' })
    .optional(),
  notes: string().optional(),
  visibility: z.enum(['public', 'protected', 'private']),
})
  .transform((data) => ({
    ...data,
    distanceInMeters: data.distanceKilometers * 1000 + data.distanceMeters,
  }))
  .refine((data) => data.distanceInMeters > 0, {
    message: 'Distanz muss größer als 0 sein',
    path: [''],
  })
  .transform((data) => ({
    ...data,
    durationInSeconds:
      data.durationHours * 3600 +
      data.durationMinutes * 60 +
      data.durationSeconds,
  }))
  .refine((data) => data.durationInSeconds > 0, {
    message: 'Dauer muss größer als 0 sein',
    path: [''],
  });
