'use client';

import { FormEvent, useCallback } from 'react';
import { Box } from '@/components/view/Box';
import { ButtonAction } from '@/components/view/ButtonAction';
import { InputImage } from '@/components/view/InputImage';
import { InputText } from '@/components/view/InputText';
import { Stack } from '@/components/view/Stack';
import { Typography } from '@/components/view/Typography';
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
    <Box padding="1" maxWidth="phone">
      <form onSubmit={onSubmit} ref={formRef}>
        <Stack alignBlock="stretch" gap="1">
          <Typography align="center">
            <h1>Registrieren</h1>
          </Typography>
          <Stack alignInline="center" direction="horizontal">
            <InputImage
              border="1"
              error={errors}
              height={200}
              label="Profilbild hinzufügen"
              name="image"
              onChange={validateFormJustInTime}
              variant="circle"
              width={200}
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
          />
        </Stack>
      </form>
    </Box>
  );
}
