import { instanceof as instanceOf, object, string } from 'zod';

const FILE_SIZE_LIMIT = 1024 * 1024 * 2; // 2 MB

export const registerSchema = object({
  email: string().email({
    message: 'Email muss eine gültige Email-Adresse sein',
  }),
  image: instanceOf(Blob, { message: 'Keine gültige Bild-Datei' })
    .refine(
      (data) => {
        return data.size < FILE_SIZE_LIMIT;
      },
      { message: 'Bild zu groß' }
    )
    .optional(),
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
  repeatPassword: string(),
}).refine((data) => data.password === data.repeatPassword, {
  message: 'Passwörter stimmen nicht überein',
  path: ['repeatPassword'],
});
