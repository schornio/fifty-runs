import { Button, ButtonVariant } from '@/components/atomics/Button';
import { ReactNode, memo } from 'react';
import { Color } from '@/style/Color';
import { PromiseState } from '@/util/usePromise';

type ActionStatusProps = {
  status?: PromiseState<unknown>['status'];
} & {
  [key in `content${Capitalize<PromiseState<unknown>['status']>}`]?: ReactNode;
};

function selectActionStatus({
  contentPending,
  contentRejected,
  contentResolved,
  contentStandby,
  status,
}: ActionStatusProps) {
  switch (status) {
    case 'pending':
      return { children: contentPending };
    case 'rejected':
      return { children: contentRejected, color: 'error' } as const;
    case 'resolved':
      return { children: contentResolved, color: 'success' } as const;
    case 'standby':
    default:
      return { children: contentStandby };
  }
}

function ButtonActionComponent({
  color,
  onClick,
  type,
  variant,
  ...statusProps
}: {
  color?: Color;
  onClick?: () => void;
  type: HTMLButtonElement['type'];
  variant?: ButtonVariant;
} & ActionStatusProps) {
  const { children, color: statusColor } = selectActionStatus(statusProps);

  const buttonColor = statusColor ?? color;
  const disabled = statusProps.status === 'pending';

  return (
    <Button
      color={buttonColor}
      disabled={disabled}
      onClick={onClick}
      type={type}
      variant={variant}
    >
      {children}
    </Button>
  );
}

export const ButtonAction = memo(ButtonActionComponent);
