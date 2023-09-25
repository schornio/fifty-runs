import { instanceof as instanceOf, object, string } from 'zod';

const FILE_SIZE_LIMIT = 1024 * 1024 * 2; // 2 MB

export const registerSchema = object({
  email: string().email({
    message: 'Email muss eine gültige Email-Adresse sein',
  }),
  groupName: string()
    .min(3, {
      message: 'Gruppenname muss mindestens 3 Zeichen lang sein',
    })
    .optional(),
  image: instanceOf(Blob, { message: 'Keine gültige Bild-Datei' })
    .refine(
      (data) => {
        return data.size < FILE_SIZE_LIMIT;
      },
      { message: 'Bild zu groß' },
    )
    .optional(),
  name: string()
    .min(3, {
      message: 'Benutzername muss mindestens 3 Zeichen lang sein',
    })
    .regex(/^[a-z0-9]+$/iu, {
      message: 'Benutzername darf nur aus Buchstaben und Zahlen bestehen',
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
})
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Passwörter stimmen nicht überein',
    path: ['repeatPassword'],
  })
  .transform((data) => ({
    ...data,
    nameId: data.name.toLowerCase().trim().replaceAll(/\s+/gu, '-'),
  }))
  .transform((data) => ({
    ...data,
    groupNameId: data.groupName?.toLowerCase().trim().replaceAll(/\s+/gu, '-'),
  }));
