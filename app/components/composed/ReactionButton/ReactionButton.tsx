'use client';

import { ReactNode, memo, useCallback } from 'react';
import { Button } from '@/components/atomics/Button';
import { PromiseState } from '@/util/usePromise';
import { ReactionType } from '@/model/reaction';

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
  count = 0,
  icon,
  onClick,
  selected,
  status,
  type,
}: {
  count?: number;
  icon?: ReactNode;
  onClick?: (clickedType: ReactionType) => void;
  selected: boolean;
  status: PromiseState['status'];
  type: ReactionType;
}) {
  const onButtonClick = useCallback(() => {
    onClick?.(type);
  }, [onClick, type]);

  return (
    <Button
      color={selectColor(status, selected)}
      onClick={onButtonClick}
      type="button"
      disabled={status === 'pending'}
      variant={selected ? 'filled' : 'outlined'}
    >
      {icon} {count > 0 ? count : undefined}
    </Button>
  );
}

export const ReactionButton = memo(ReactionButtonComponent);
