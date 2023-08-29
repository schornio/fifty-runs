import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(10, { message: 'Passwort mindestens 10 Zeichen lang sein' })
      .regex(/[a-z]/u, {
        message: 'Passwort muss mindestens einen Kleinbuchstaben enthalten',
      })
      .regex(/[A-Z]/u, {
        message: 'Passwort muss mindestens einen Großbuchstaben enthalten',
      })
      .regex(/[0-9]/u, {
        message: 'Passwort muss mindestens eine Zahl enthalten',
      })
      .regex(/[^a-zA-Z0-9]/u, {
        message: 'Passwort muss ein mindestens Sonderzeichen enthalten',
      }),
    passwordResetToken: z
      .string()
      .min(32 * 2)
      .max(32 * 2),
    repeatNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.repeatNewPassword, {
    message: 'Passwörter stimmen nicht überein',
    path: ['repeatPassword'],
  });
