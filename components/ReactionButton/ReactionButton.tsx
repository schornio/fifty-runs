'use client';

import { PromiseState, usePromise } from '@/util/usePromise';
import { ReactNode, useCallback } from 'react';
import { Button } from '@/components/view/Button';
import { ReactionType } from '@/model/reaction';
import styles from './ReactionButton.module.css';
import { useRouter } from 'next/navigation';

async function updateReaction({
  exerciseId,
  selected,
  type,
}: {
  exerciseId: string;
  selected: boolean;
  type: ReactionType;
}) {
  const body = new FormData();
  body.append('type', type);

  const response = await fetch(`/api/runningExercise/${exerciseId}/react`, {
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
      return selected ? 'green' : 'blue';
    case 'rejected':
      return 'error';
  }
}

export function ReactionButton({
  children,
  exerciseId,
  selected,
  tooltip,
  type,
}: {
  children: ReactNode;
  exerciseId: string;
  selected: boolean;
  tooltip: ReactNode;
  type: ReactionType;
}) {
  const { refresh } = useRouter();
  const { invoke, status } = usePromise(updateReaction);

  const onClick = useCallback(async () => {
    await invoke({ exerciseId, selected, type });
    refresh();
  }, [invoke, exerciseId, selected, type, refresh]);

  return (
    <div className={styles['tooltip-container']}>
      <Button
        color={selectColor(status, selected)}
        onClick={onClick}
        type="button"
        variant={selected ? 'fill' : 'outline'}
      >
        {status === 'pending' ? '...' : children}
      </Button>
      {tooltip ? <div className={styles.tooltip}>{tooltip}</div> : undefined}
    </div>
  );
}
