'use client';

import { FormEvent, useCallback } from 'react';
import { Box } from '@/components/atomics/Box';
import { ButtonAction } from '@/components/composed/ButtonAction';
import { InputText } from '@/components/atomics/InputText';
import { Stack } from '@/components/atomics/Stack';
import { resetPasswordSchema } from '@/schema/resetPassword';
import { usePromise } from '@/util/usePromise';
import { useRouter } from 'next/navigation';
import { useValidation } from '@/util/form/useValidation';

async function passwordReset(formData: FormData) {
  const result = await fetch(`/api/user/passwordForgotten/reset`, {
    body: formData,
    method: 'POST',
  });
  if (!result.ok) {
    throw new Error();
  }
}

export function PasswordResetForm({
  passwordResetToken,
}: {
  passwordResetToken: string;
}) {
  const router = useRouter();
  const { errors, formRef, validateForm, validateFormJustInTime } =
    useValidation(resetPasswordSchema);
  const { invoke: invokeChangePassword, status } = usePromise(passwordReset);

  const onSubmit = useCallback(
    async (eventArgs: FormEvent<HTMLFormElement>) => {
      eventArgs.preventDefault();
      const formData = validateForm();

      if (formData) {
        const result = await invokeChangePassword(formData);

        if (result.status === 'resolved') {
          router.refresh();
          router.push('/user/login');
        }
      }
    },
    [validateForm, invokeChangePassword, router],
  );

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
          <input
            type="hidden"
            name="passwordResetToken"
            value={passwordResetToken}
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
        </Stack>
      </form>
    </Box>
  );
}
