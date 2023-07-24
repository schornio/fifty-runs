import { ReactNode, memo } from 'react';
import { Button } from '@/components/view/Button';
import type { PromiseState } from '@/util/usePromise';
import { mapStyles } from '@/util/mapStyles';
import styles from './ButtonAction.module.css';

type StateProps = {
  status?: PromiseState<unknown>['status'];
} & {
  [key in `content${Capitalize<PromiseState<unknown>['status']>}`]?: ReactNode;
};

function selectState({
  contentPending,
  contentRejected,
  contentResolved,
  contentStandby,
  status,
}: StateProps) {
  switch (status) {
    case 'pending':
      return { children: contentPending, color: undefined };
    case 'rejected':
      return { children: contentRejected, color: 'error' } as const;
    case 'resolved':
      return { children: contentResolved, color: 'success' } as const;
    default:
      return { children: contentStandby, color: undefined };
  }
}

function ButtonActionComponent({
  color = 'blue',
  onClick,
  type = 'submit',
  variant = 'fill',
  ...stateProps
}: {
  color?: 'blue' | 'green';
  onClick?: () => void;
  type?: HTMLButtonElement['type'];
  variant?: 'fill' | 'outline' | 'text';
} & StateProps) {
  const { children, color: stateColor } = selectState(stateProps);
  const className = mapStyles(styles, { color, default: true, variant });
  return (
    <Button
      color={stateColor ?? color}
      disabled={stateProps.status === 'pending'}
      onClick={onClick}
      type={type}
      variant={variant}
    >
      {children}
    </Button>
  );
}

export const ButtonAction = memo(ButtonActionComponent);
