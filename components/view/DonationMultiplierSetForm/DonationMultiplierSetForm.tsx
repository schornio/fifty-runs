'use client';

import {
  ButtonRadioGroup,
  ButtonRadioItem,
} from '@/components/composed/ButtonRadioGroup';
import { FormEvent, useCallback, useState } from 'react';
import { Box } from '@/components/atomics/Box';
import { Button } from '@/components/atomics/Button';
import { ButtonAction } from '@/components/composed/ButtonAction';
import { Stack } from '@/components/atomics/Stack';
import { donationMultiplierSchema } from '@/schema/donationMultiplier';
import { usePromise } from '@/util/usePromise';
import { useRouter } from 'next/navigation';
import { useValidation } from '@/util/form/useValidation';

const multiplierItems: ButtonRadioItem[] = [
  {
    id: 'nothing',
    label: 'Keine Spende',
  },
  {
    id: 'x1',
    label: '1 €',
  },
  {
    id: 'x2',
    label: '2 €',
  },
  {
    id: 'x5',
    label: '5 €',
  },
  {
    id: 'x10',
    label: '10 €',
  },
];

async function changeDonationMultiplier(formData: FormData) {
  const result = await fetch('/api/user/changeDonationMultiplier', {
    body: formData,
    method: 'POST',
  });
  if (!result.ok) {
    throw new Error();
  }
}

export function DonationMultiplierSetForm({
  runDonationMultiplier,
}: {
  runDonationMultiplier?: string | null;
}) {
  const router = useRouter();
  const { formRef, validateForm } = useValidation(donationMultiplierSchema);
  const { invoke: invokeChangePassword, status } = usePromise(
    changeDonationMultiplier,
  );
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
      <Button color="gold" onClick={onShowClick} type="button">
        Spenden pro Lauf ändern
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
            <h2>Geldspende pro Lauf</h2>
          </Box>
          <ButtonRadioGroup
            color="gold"
            defaultItemId={runDonationMultiplier ?? 'nothing'}
            items={multiplierItems}
            name="donationMultiplier"
          />
          <ButtonAction
            contentPending="Spende ändern..."
            contentRejected="Spende ändern fehlgeschlagen"
            contentResolved="Spende ändern erfolgreich"
            contentStandby="Spende ändern"
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
