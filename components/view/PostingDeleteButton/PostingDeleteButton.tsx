'use client';

import { ButtonAction } from '@/components/composed/ButtonAction';
import { useCallback } from 'react';
import { usePromise } from '@/util/usePromise';
import { useRouter } from 'next/navigation';

async function deletePosting(id: string) {
  const result = await fetch(`/api/posting/${id}`, {
    method: 'DELETE',
  });
  if (!result.ok) {
    throw new Error();
  }
}

export function PostingDeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const { invoke: invokeDeleteComment, status } = usePromise(deletePosting);

  const onClick = useCallback(async () => {
    const result = await invokeDeleteComment(id);
    if (result.status === 'resolved') {
      router.push('/postings');
    }
  }, [invokeDeleteComment, id, router]);

  return (
    <ButtonAction
      color="error"
      contentPending="Löschen..."
      contentRejected="Löschen fehlgeschlagen"
      contentResolved="Beitrag gelöscht"
      contentStandby="Beitrag löschen"
      onClick={onClick}
      status={status}
      type="button"
    />
  );
}
