import { ReactNode, memo } from 'react';
import { mapStyles } from '@/util/mapStyles';
import styles from './Button.module.css';

function ButtonComponent({
  children,
  color = 'blue',
  disabled,
  onClick,
  type = 'button',
  variant = 'fill',
}: {
  children?: ReactNode;
  color?: 'blue' | 'green' | 'success' | 'error';
  disabled?: boolean;
  onClick?: () => void;
  type?: HTMLButtonElement['type'];
  variant?: 'fill' | 'outline' | 'text';
}) {
  const className = mapStyles(styles, {
    color,
    default: true,
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
