'use client';

import { FormEvent, useCallback, useState } from 'react';
import { Box } from '@/components/atomics/Box';
import { Button } from '@/components/atomics/Button';
import { ButtonAction } from '@/components/composed/ButtonAction';
import { InputText } from '@/components/atomics/InputText';
import { Stack } from '@/components/atomics/Stack';
import { changePasswordSchema } from '@/schema/changePassword';
import { usePromise } from '@/util/usePromise';
import { useRouter } from 'next/navigation';
import { useValidation } from '@/util/form/useValidation';

async function login(formData: FormData) {
  const result = await fetch('/api/user/changePassword', {
    body: formData,
    method: 'POST',
  });
  if (!result.ok) {
    throw new Error();
  }
}

export function PasswordChangeForm() {
  const router = useRouter();
  const { errors, formRef, validateForm, validateFormJustInTime } =
    useValidation(changePasswordSchema);
  const { invoke: invokeChangePassword, status } = usePromise(login);
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
        const result = await invokeChangePassword(formData);

        if (result.status === 'resolved') {
          router.refresh();
        }
      }
    },
    [validateForm, invokeChangePassword, router],
  );

  if (!formVisible) {
    return (
      <Button onClick={onShowClick} type="button">
        Passwort ändern
      </Button>
    );
  }

  return (
    <Box
      color="secondary"
      maxWidth="mobile"
      padding="normal"
      roundedCorners={true}
      variant="outlined"
    >
      <form onSubmit={onSubmit} ref={formRef}>
        <Stack alignBlock="stretch" direction="column" gap="normal">
          <Box textAlign="center">
            <h2>Passwort ändern</h2>
          </Box>
          <InputText
            error={errors}
            label="Altes Passwort"
            name="oldPassword"
            onChange={validateFormJustInTime}
            type="password"
          />
          <InputText
            error={errors}
            label="Neues Passwort"
            name="newPassword"
            onChange={validateFormJustInTime}
            type="password"
          />
          <InputText
            error={errors}
            label="Neues Passwort wiederholen"
            name="repeatNewPassword"
            onChange={validateFormJustInTime}
            type="password"
          />
          <ButtonAction
            contentPending="Passwort ändern..."
            contentRejected="Passwort ändern fehlgeschlagen"
            contentResolved="Passwort ändern erfolgreich"
            contentStandby="Passwort ändern"
            status={status}
            type="submit"
          />
          <Button onClick={onHideClick} type="button" variant="text">
            Abbrechen
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
