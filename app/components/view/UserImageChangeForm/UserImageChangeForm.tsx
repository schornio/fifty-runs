'use client';

import { FormEvent, useCallback, useState } from 'react';
import { Button } from '@/components/atomics/Button';
import { ButtonAction } from '@/components/composed/ButtonAction';
import { InputImage } from '@/components/atomics/InputImage';
import { changeUserImageSchema } from '@/schema/changeUserImage';
import { usePromise } from '@/util/usePromise';
import { useRouter } from 'next/navigation';
import { useValidation } from '@/util/form/useValidation';

async function updateImage(formData: FormData) {
  const result = await fetch('/api/user/image', {
    body: formData,
    method: 'PUT',
  });
  if (!result.ok) {
    throw new Error();
  }
}

export function UserImageChangeForm() {
  const router = useRouter();
  const { errors, formRef, validateForm, validateFormJustInTime } =
    useValidation(changeUserImageSchema);
  const { invoke: invokeUpdateImage, status } = usePromise(updateImage);
  const [formVisible, setFormVisible] = useState(false);

  const onShowClick = useCallback(() => {
    setFormVisible(true);
  }, []);

  const onHideClick = useCallback(() => {
    setFormVisible(false);
  }, []);

  const onSubmit = useCallback(
    async (eventArgs: FormEvent<HTMLFormElement>) => {
      eventArgs.preventDefault();
      const formData = validateForm();

      if (formData) {
        const result = await invokeUpdateImage(formData);

        if (result.status === 'resolved') {
          router.refresh();
          setFormVisible(false);
        }
      }
    },
    [validateForm, invokeUpdateImage, router],
  );

  if (!formVisible) {
    return (
      <Button onClick={onShowClick} type="button">
        Profilbild ändern
      </Button>
    );
  }

  return (
    <div className="rounded-xl border border-congress-blue-900 bg-white p-4">
      <form onSubmit={onSubmit} ref={formRef}>
        <div className="flex flex-col gap-5">
          <h2 className="text-center text-xl">Profilbild ändern</h2>
          <div className="self-center">
            <InputImage
              error={errors}
              label="Bild hinzufügen"
              name="image"
              onChange={validateFormJustInTime}
              type="userImage"
            />
          </div>
          <ButtonAction
            contentPending="Ändern..."
            contentRejected="Ändern fehlgeschlagen"
            contentResolved="Hinzugefügt"
            contentStandby="Ändern"
            status={status}
            type="submit"
          />
          <Button onClick={onHideClick} type="button" variant="text">
            Abbrechen
          </Button>
        </div>
      </form>
    </div>
  );
}
