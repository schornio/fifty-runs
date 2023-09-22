import { ReactNode, memo } from 'react';
import { Button } from '@/components/atomics/Button';
import { Color } from '@/style/Color';
import { PromiseState } from '@/util/usePromise';
import { cn } from '@/util/cn';

type ActionStatusProps = {
  status?: PromiseState<unknown>['status'];
} & {
  [key in `content${Capitalize<PromiseState<unknown>['status']>}`]?: ReactNode;
};

function selectActionContent({
  contentPending,
  contentRejected,
  contentResolved,
  contentStandby,
  status,
}: ActionStatusProps) {
  switch (status) {
    case 'pending':
      return contentPending;
    case 'rejected':
      return contentRejected;
    case 'resolved':
      return contentResolved;
    case 'standby':
    default:
      return contentStandby;
  }
}

function ButtonActionComponent({
  color,
  disabled = false,
  onClick,
  type,
  ...statusProps
}: {
  color?: Color;
  disabled?: boolean;
  onClick?: () => void;
  type: HTMLButtonElement['type'];
} & ActionStatusProps) {
  const content = selectActionContent(statusProps);

  const computedDisabled = disabled || statusProps.status === 'pending';

  return (
    <>
      <Button
        className={cn(
          {
            'bg-red-500': color === 'error',
          },
          {
            'bg-green-500': statusProps.status === 'resolved',
            'bg-neutral-300': computedDisabled,
            'bg-red-500': statusProps.status === 'rejected',
          },
        )}
        disabled={computedDisabled}
        onClick={onClick}
        type={type}
      >
        {content}
      </Button>
    </>
  );
}

export const ButtonAction = memo(ButtonActionComponent);
