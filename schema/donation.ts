import { postingSchemaBase } from '@/schema/posting';
import { z } from 'zod';

export const donationSchema = postingSchemaBase
  .extend({
    amountCent: z.coerce
      .number()
      .int('Betrag in Cent muss eine ganze Zahl sein')
      .default(0),
    amountEuro: z.coerce
      .number()
      .int('Betrag in Euro muss eine ganze Zahl sein')
      .default(0),
    type: z.literal('donation'),
    visibility: z.enum(['public', 'protected', 'private']),
  })
  .transform((data) => ({
    ...data,
    amountInCent: data.amountEuro * 100 + data.amountCent,
  }))
  .refine((data) => data.amountInCent > 0, {
    message: 'Betrag muss größer als 0 sein',
    path: [''],
  });
