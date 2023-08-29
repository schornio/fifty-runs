'use client';

import { FormEvent, useCallback, useState } from 'react';
import { Box } from '@/components/atomics/Box';
import { ButtonAction } from '@/components/composed/ButtonAction';
import { InputText } from '@/components/atomics/InputText';
import { Stack } from '@/components/atomics/Stack';
import { Text } from '@/components/atomics/Text';
import { usePromise } from '@/util/usePromise';

async function passwordForgotten(formData: FormData) {
  const result = await fetch('/api/user/passwordForgotten', {
    body: formData,
    method: 'POST',
  });
  if (!result.ok) {
    throw new Error();
  }
}

export function PasswordForgottenForm() {
  const [formState, setFormState] = useState<'standby' | 'success'>('standby');
  const { invoke: invokePasswordForgotten, status } =
    usePromise(passwordForgotten);

  const onSubmit = useCallback(
    async (eventArgs: FormEvent<HTMLFormElement>) => {
      eventArgs.preventDefault();
      const formData = new FormData(eventArgs.currentTarget);

      if (formData) {
        const result = await invokePasswordForgotten(formData);

        if (result.status === 'resolved') {
          setFormState('success');
        }
      }
    },
    [invokePasswordForgotten],
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
            Ändere dein Passwort in dem du auf den Link in der dir zugesandten
            Email klickst.
          </Text>
        </Box>
      ) : (
        <form onSubmit={onSubmit}>
          <Stack alignBlock="stretch" direction="column" gap="normal">
            <Box textAlign="center">
              <h1>Passwort vergessen</h1>
            </Box>
            <InputText
              label="Benutzername oder Email"
              name="name"
              type="text"
            />
            <ButtonAction
              contentPending="Anfrage senden..."
              contentRejected="Anfrage senden fehlgeschlagen"
              contentResolved="Anfrage senden erfolgreich"
              contentStandby="Anfrage senden"
              status={status}
              type="submit"
            />
          </Stack>
        </form>
      )}
    </Box>
  );
}
