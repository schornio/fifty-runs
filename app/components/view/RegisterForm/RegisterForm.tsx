'use client';

import { FormEvent, useCallback, useState } from 'react';
import { Box } from '@/components/atomics/Box';
import { ButtonAction } from '@/components/composed/ButtonAction';
import { InputImage } from '@/components/atomics/InputImage';
import { InputText } from '@/components/atomics/InputText';
import { Stack } from '@/components/atomics/Stack';
import { Text } from '@/components/atomics/Text';
import { registerSchema } from '@/schema/register';
import { usePromise } from '@/util/usePromise';
import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const [formState, setFormState] = useState<'standby' | 'success'>('standby');
  const { errors, formRef, validateForm, validateFormJustInTime } =
    useValidation(registerSchema);
  const { invoke: invokeRegister, status } = usePromise(register);

  const onSubmit = useCallback(
    async (eventArgs: FormEvent<HTMLFormElement>) => {
      eventArgs.preventDefault();
      const formData = validateForm();

      if (formData) {
        await invokeRegister(formData);
        setFormState('success');
      }
    },
    [validateForm, invokeRegister],
  );

  return (
    <Box padding="double" maxWidth="mobile">
      {formState === 'success' ? (
        <Box
          color="secondary"
          padding="normal"
          roundedCorners={true}
          textAlign="center"
          variant="filled"
        >
          <Text color="background" fontSize="heading3">
            Bitte bestätige deine E-Mail-Adresse, indem du auf den Link in der
            Bestätigungsmail klickst.
          </Text>
        </Box>
      ) : (
        <form onSubmit={onSubmit} ref={formRef}>
          <Stack alignBlock="stretch" direction="column" gap="normal">
            <Box textAlign="center">
              <h1>Registrieren</h1>
            </Box>
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
            <InputText
              defaultValue={searchParams.get('group') ?? undefined}
              error={errors}
              label="Optional: Teilnahme an einer Gruppe"
              name="groupName"
              onChange={validateFormJustInTime}
              type="text"
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
      )}
    </Box>
  );
}
