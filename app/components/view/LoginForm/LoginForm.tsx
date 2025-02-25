'use client';

import { FormEvent, useCallback } from 'react';
import { Box } from '@/components/atomics/Box';
import { ButtonAction } from '@/components/composed/ButtonAction';
import { InputText } from '@/components/atomics/InputText';
import Link from 'next/link';
import { Stack } from '@/components/atomics/Stack';
import { Text } from '@/components/atomics/Text';
import { loginSchema } from '@/schema/login';
import { usePromise } from '@/util/usePromise';
import { useRouter, useSearchParams } from 'next/navigation';
import { useValidation } from '@/util/form/useValidation';

async function login(formData: FormData) {
  const result = await fetch('/api/session', {
    body: formData,
    method: 'POST',
  });
  if (!result.ok) {
    throw new Error('Login fehlgeschlagen');
  }
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/postings'; // Fallback auf /postings, falls kein redirect angegeben ist.
  const { errors, formRef, validateForm, validateFormJustInTime } = useValidation(loginSchema);
  const { invoke: invokeLogin, status } = usePromise(login);

  const onSubmit = useCallback(
    async (eventArgs: FormEvent<HTMLFormElement>) => {
      eventArgs.preventDefault();
      const formData = validateForm();

      if (formData) {
        const result = await invokeLogin(formData);

        if (result.status === 'resolved') {
          router.push(redirect);
          router.refresh();
        }
      }
    },
    [validateForm, invokeLogin, router, redirect],
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
          <Box textAlign="center">
            <Link href="/user/passwordForgotten">
              <Text color="primary">Passwort vergessen?</Text>
            </Link>
          </Box>
          <Box textAlign="center">
            {/* Link zur Registrierungsseite mit demselben Redirect-Parameter */}
            <Link href={`/user/register?redirect=${encodeURIComponent(redirect)}`}>
              <Text color="primary">Noch kein Konto? Registrieren</Text>
            </Link>
          </Box>
        </Stack>
      </form>
    </Box>
  );
}
