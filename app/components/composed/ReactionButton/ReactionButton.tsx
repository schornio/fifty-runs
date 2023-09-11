'use client';

import { ReactNode, memo, useCallback } from 'react';
import { PromiseState } from '@/util/usePromise';
import { ReactionType } from '@/model/reaction';
import { cn } from '@/util/cn';

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
    <button
      className={cn(
        'flex gap-3 rounded-full border-2 border-congress-blue-900 px-4 py-2 font-bold text-congress-blue-900',
        {
          'border-atlantis-500 text-atlantis-500': selected,
          'border-red-500': status === 'rejected',
        },
        {
          'border-neutral-300 text-neutral-300': status === 'pending',
        },
      )}
      disabled={status === 'pending'}
      onClick={onButtonClick}
      type="button"
    >
      {icon} {count > 0 ? count : undefined}
    </button>
  );
}

export const ReactionButton = memo(ReactionButtonComponent);
