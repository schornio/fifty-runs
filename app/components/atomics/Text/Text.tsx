import { ReactNode, memo } from 'react';
import { Color } from '@/style/Color';
import { FontSize } from '@/style/FontSize';
import { FontWeight } from '@/style/FontWeight';
import { cn } from '@/util/cn';

function TextComponent({
  children,
  className,
  color = 'text',
  fontSize = 'normal',
  fontWeight = 'normal',
}: {
  children?: ReactNode;
  className?: string;
  color?: Color;
  fontSize?: FontSize;
  fontWeight?: FontWeight;
}) {
  return (
    <span
      className={cn(
        {
          'text-atlantis-500': color === 'secondary',
          'text-black': color === 'text',
          'text-congress-blue-900': color === 'primary',
          'text-gold-500': color === 'gold',
          'text-green-500': color === 'success',
          'text-neutral-300': color === 'gray',
          'text-red-500': color === 'error',
          'text-white': color === 'background',
        },
        {
          'text-2xl': fontSize === 'heading2',
          'text-3xl': fontSize === 'heading1',
          'text-md': fontSize === 'normal',
          'text-xl': fontSize === 'heading3',
          'text-xs': fontSize === 'sub',
        },
        {
          'font-bold': fontWeight === 'bold',
          'font-normal': fontWeight === 'normal',
        },
        className,
      )}
    >
      {children}
    </span>
  );
}

export const Text = memo(TextComponent);
