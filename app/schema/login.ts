import { object, string } from 'zod';

export const loginSchema = object({
  name: string().min(3, {
    message: 'Benutzername muss mindestens 3 Zeichen lang sein',
  }),
  password: string()
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
});
