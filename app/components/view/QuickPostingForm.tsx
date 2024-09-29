'use client';

import { FormEvent, useCallback, useState } from 'react';
import { Box } from '@/components/atomics/Box';
import { Button } from '@/components/atomics/Button';
import { ButtonAction } from '@/components/composed/ButtonAction';
import { Stack } from '@/components/atomics/Stack';
import { usePromise } from '@/util/usePromise';
import { useRouter } from 'next/navigation';

async function quickPosting() {
  const result = await fetch('/api/posting/quick', {
    method: 'POST',
  });
  if (!result.ok) {
    throw new Error();
  }
}

export function QuickPostingForm() {
  const router = useRouter();
  const { invoke: invokeQuickPosting, status } = usePromise(quickPosting);
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
      const formData = new FormData(eventArgs.currentTarget);

      if (formData) {
        const result = await invokeQuickPosting(undefined);

        if (result.status === 'resolved') {
          router.refresh();
          setFormVisible(false);
        }
      }
    },
    [invokeQuickPosting, router],
  );

  if (!formVisible) {
    return (
      <Button
        onClick={onShowClick}
        type="button"
        variant="special-quick-posting"
      >
        +1 Lauf
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
      <form onSubmit={onSubmit}>
        <Stack alignBlock="stretch" direction="column" gap="normal">
          <ButtonAction
            contentPending="+1 ..."
            contentRejected="Hinzufügen fehlgeschlagen"
            contentResolved="+1"
            contentStandby="+1 Lauf bestätigen"
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
