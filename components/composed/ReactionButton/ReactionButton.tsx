'use client';

import { PromiseState, usePromise } from '@/util/usePromise';
import { ReactNode, memo, useCallback, useState } from 'react';
import { Button } from '@/components/atomics/Button';
import { ReactionType } from '@/model/reaction';

async function updateReaction({
  postingId,
  selected,
  type,
}: {
  postingId: string;
  selected: boolean;
  type: ReactionType;
}) {
  const body = new FormData();
  body.append('type', type);

  const response = await fetch(`/api/posting/${postingId}/react`, {
    body,
    method: selected ? 'DELETE' : 'PUT',
  });

  if (!response.ok) {
    throw new Error('Could not create reaction');
  }
}

function selectColor(status: PromiseState['status'], selected: boolean) {
  switch (status) {
    case 'standby':
    case 'pending':
    case 'resolved':
    default:
      return selected ? 'secondary' : 'primary';
    case 'rejected':
      return 'error';
  }
}

function ReactionButtonComponent({
  count,
  icon,
  postingId,
  selected,
  type,
}: {
  count?: number;
  icon?: ReactNode;
  postingId: string;
  selected: boolean;
  type: ReactionType;
}) {
  const { invoke, status } = usePromise(updateReaction);

  const [cachedCount, setCachedCount] = useState(count ?? 0);
  const [cachedSelected, setCachedSelected] = useState(selected);

  const onClick = useCallback(async () => {
    setCachedCount((currentCount) => currentCount + (selected ? -1 : 1));
    setCachedSelected((currentSelected) => !currentSelected);
    const { status: invokeStatus } = await invoke({
      postingId,
      selected,
      type,
    });
    if (invokeStatus === 'rejected') {
      // Reset the state if the request failed
      setCachedCount((currentCount) => currentCount + (selected ? 1 : -1));
      setCachedSelected((currentSelected) => !currentSelected);
    }
  }, [invoke, postingId, selected, type]);

  return (
    <Button
      color={selectColor(status, cachedSelected)}
      onClick={onClick}
      type="button"
      disabled={status === 'pending'}
      variant={cachedSelected ? 'filled' : 'outlined'}
    >
      {icon} {cachedCount > 0 ? cachedCount : undefined}
    </Button>
  );
}

export const ReactionButton = memo(ReactionButtonComponent);
