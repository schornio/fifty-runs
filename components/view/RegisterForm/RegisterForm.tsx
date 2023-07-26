'use client';

import { FormEvent, useCallback } from 'react';
import { Box } from '@/components/atomics/Box';
import { ButtonAction } from '@/components/composed/ButtonAction';
import { InputImage } from '@/components/atomics/InputImage';
import { InputText } from '@/components/atomics/InputText';
import { Stack } from '@/components/atomics/Stack';
import { Text } from '@/components/atomics/Text';
import { registerSchema } from '@/schema/register';
import { usePromise } from '@/util/usePromise';
import { useRouter } from 'next/navigation';
import { useValidation } from '@/util/form/useValidation';

async function register(formData: FormData) {
  const result = await fetch('/api/user', {
    body: formData,
    method: 'POST',
  });
  if (!result.ok) {
    throw new Error();
  }
}

export function RegisterForm() {
  const router = useRouter();
  const { errors, formRef, validateForm, validateFormJustInTime } =
    useValidation(registerSchema);
  const { invoke: invokeRegister, status } = usePromise(register);

  const onSubmit = useCallback(
    async (eventArgs: FormEvent<HTMLFormElement>) => {
      eventArgs.preventDefault();
      const formData = validateForm();

      if (formData) {
        const result = await invokeRegister(formData);

        if (result.status === 'resolved') {
          router.push('/user');
          router.refresh();
        }
      }
    },
    [validateForm, invokeRegister, router]
  );

  return (
    <Box padding="double" maxWidth="mobile">
      <form onSubmit={onSubmit} ref={formRef}>
        <Stack alignBlock="stretch" direction="column" gap="normal">
          <Text textAlign="center">
            <h1>Registrieren</h1>
          </Text>
          <Stack alignInline="center" direction="row">
            <InputImage
              error={errors}
              label="Profilbild hinzufügen"
              name="image"
              onChange={validateFormJustInTime}
              type="userImage"
            />
          </Stack>
          <InputText
            error={errors}
            label="Benutzername"
            name="name"
            onChange={validateFormJustInTime}
            type="text"
          />
          <InputText
            error={errors}
            label="Email"
            name="email"
            onChange={validateFormJustInTime}
            type="email"
          />
          <InputText
            error={errors}
            label="Passwort"
            name="password"
            onChange={validateFormJustInTime}
            type="password"
          />
          <InputText
            error={errors}
            label="Passwort wiederholen"
            name="repeatPassword"
            onChange={validateFormJustInTime}
            type="password"
          />

          <ButtonAction
            contentPending="Registrieren..."
            contentRejected="Registrierung fehlgeschlagen"
            contentResolved="Registrierung erfolgreich"
            contentStandby="Registrieren"
            status={status}
            type="submit"
          />
        </Stack>
      </form>
    </Box>
  );
}
