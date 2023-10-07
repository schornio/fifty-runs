'use client';

import { ButtonAction } from '@/components/composed/ButtonAction';
import { useCallback } from 'react';
import { usePromise } from '@/util/usePromise';
import { useRouter } from 'next/navigation';

async function dismiss() {
  const result = await fetch('/api/user/dismissDonationReminder', {
    method: 'POST',
  });
  if (!result.ok) {
    throw new Error();
  }
}

export function DismissDonationReminder() {
  const router = useRouter();
  const { invoke: invokeDismiss, status } = usePromise(dismiss);

  const onDismissClick = useCallback(() => {
    invokeDismiss(undefined).then(() => {
      router.refresh();
    });
  }, [invokeDismiss, router]);

  return (
    <ButtonAction
      contentPending="Später erinnern ..."
      contentRejected="Fehler"
      contentResolved="Erfolg"
      contentStandby="Später erinnern"
      onClick={onDismissClick}
      status={status}
      type="button"
    />
  );
}
