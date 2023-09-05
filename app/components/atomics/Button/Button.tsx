import { ReactNode, memo } from 'react';
import { cn } from '@/util/cn';

export type ButtonProps = {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type: HTMLButtonElement['type'];
  variant?: ButtonVariant;
};

export type ButtonVariant =
  | 'filled-primary'
  | 'outlined-primary'
  | 'outlined-secondary'
  | 'text';

function ButtonComponent({
  children,
  className,
  disabled = false,
  onClick,
  type,
  variant = 'filled-primary',
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-full p-2 font-semibold',
        {
          'bg-congress-blue-900 text-white': variant === 'filled-primary',
          'border-2 border-atlantis-500 text-atlantis-500':
            variant === 'outlined-secondary',
          'border-2 border-congress-blue-900 text-congress-blue-900':
            variant === 'outlined-primary',
        },
        className,
      )}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

export const Button = memo(ButtonComponent);
