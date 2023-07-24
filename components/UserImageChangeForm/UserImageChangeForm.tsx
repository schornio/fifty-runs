'use client';

import { FormEvent, useState } from 'react';
import { InputImage } from '@/components/view/InputImage';
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
    <form onSubmit={onSubmit}>
      <InputImage
        height={300}
        label="Bild hinzufügen"
        name="image"
        width={600}
      />
      <button type="submit">Speichern</button>
      {errors.length > 0 ? (
        <ul>
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}
    </form>
  );
}
