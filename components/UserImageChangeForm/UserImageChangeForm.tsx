'use client';

import { FormEvent, useState } from 'react';
import { InputImage } from '@/components/atomics/InputImage';
import { useRouter } from 'next/navigation';

export function UserImageChangeForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);

  const onSubmit = async (eventArgs: FormEvent<HTMLFormElement>) => {
    eventArgs.preventDefault();
    setErrors([]);

    const formData = new FormData(eventArgs.currentTarget);

    try {
      const result = await fetch('/api/user/image', {
        body: formData,
        method: 'POST',
      });

      if (result.ok) {
        router.refresh();
      } else {
        throw new Error('Fehler beim Speichern');
      }
    } catch (error) {
      setErrors((currentErrors) => [...currentErrors, String(error)]);
    }
  };

  return (
    <>
      <h2>Profilbild ändern</h2>
      <form onSubmit={onSubmit}>
        <InputImage label="Bild hinzufügen" name="image" type="userImage" />
        <button type="submit">Speichern</button>
        {errors.length > 0 ? (
          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        ) : null}
      </form>
    </>
  );
}
