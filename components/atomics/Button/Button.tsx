import { ReactNode, memo } from 'react';
import { Color } from '@/style/Color';
import { mapStyles } from '@/util/mapStyles';
import styles from './Button.module.css';

export type ButtonVariant = 'filled' | 'outlined' | 'text';

function ButtonComponent({
  children,
  color = 'primary',
  disabled = false,
  onClick,
  type,
  variant = 'filled',
}: {
  children?: ReactNode;
  color?: Color;
  disabled?: boolean;
  onClick?: () => void;
  type: HTMLButtonElement['type'];
  variant?: ButtonVariant;
}) {
  const className = mapStyles(styles, ['default'], {
    color,
    disabled,
    variant,
  });
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

export const Button = memo(ButtonComponent);
