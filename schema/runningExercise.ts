import { postingSchemaBase } from '@/schema/posting';
import { z } from 'zod';

export const runningExperciseSchema = postingSchemaBase
  .extend({
    distanceKilometers: z.coerce
      .number()
      .int('Distanz in Kilometern muss eine ganze Zahl sein')
      .default(0),
    distanceMeters: z.coerce
      .number()
      .int('Distanz in Metern muss eine ganze Zahl sein')
      .default(0),
    durationHours: z.coerce
      .number()
      .int('Stunden muss eine ganze Zahl sein')
      .default(0),
    durationMinutes: z.coerce
      .number()
      .int('Minuten muss eine ganze Zahl sein')
      .default(0),
    durationSeconds: z.coerce
      .number()
      .int('Sekunden muss eine ganze Zahl sein')
      .default(0),
    type: z.literal('runningExercise'),
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
