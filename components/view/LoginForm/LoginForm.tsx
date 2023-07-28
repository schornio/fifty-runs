'use client';

import { FormEvent, useCallback } from 'react';
import { Box } from '@/components/atomics/Box';
import { ButtonAction } from '@/components/composed/ButtonAction';
import { InputText } from '@/components/atomics/InputText';
import { Stack } from '@/components/atomics/Stack';
import { loginSchema } from '@/schema/login';
import { usePromise } from '@/util/usePromise';
import { useRouter } from 'next/navigation';
import { useValidation } from '@/util/form/useValidation';

async function login(formData: FormData) {
  const result = await fetch('/api/session', {
    body: formData,
    method: 'POST',
  });
  if (!result.ok) {
    throw new Error();
  }
}

export function LoginForm() {
  const router = useRouter();
  const { errors, formRef, validateForm, validateFormJustInTime } =
    useValidation(loginSchema);
  const { invoke: invokeLogin, status } = usePromise(login);

  const onSubmit = useCallback(
    async (eventArgs: FormEvent<HTMLFormElement>) => {
      eventArgs.preventDefault();
      const formData = validateForm();

      if (formData) {
        const result = await invokeLogin(formData);

        if (result.status === 'resolved') {
          router.refresh();
          router.push('/postings');
        }
      }
    },
    [validateForm, invokeLogin, router]
  );

  return (
    <Box padding="double" maxWidth="mobile">
      <form onSubmit={onSubmit} ref={formRef}>
        <Stack alignBlock="stretch" direction="column" gap="normal">
          <Box textAlign="center">
            <h1>Anmelden</h1>
          </Box>
          <InputText
            error={errors}
            label="Benutzername oder Email"
            name="name"
            onChange={validateFormJustInTime}
            type="text"
          />
          <InputText
            error={errors}
            label="Passwort"
            name="password"
            onChange={validateFormJustInTime}
            type="password"
          />
          <ButtonAction
            contentPending="Anmelden..."
            contentRejected="Anmelden fehlgeschlagen"
            contentResolved="Anmeldung erfolgreich"
            contentStandby="Anmelden"
            status={status}
            type="submit"
          />
        </Stack>
      </form>
    </Box>
  );
}
