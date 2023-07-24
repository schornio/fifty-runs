import { ReactNode, memo } from 'react';
import { mapStyles } from '@/util/mapStyles';
import styles from './Typography.module.css';

function TypographyComponent({
  align = 'left',
  children,
  color = 'default',
  size = 'normal',
}: {
  align?: 'left' | 'center' | 'right';
  children?: ReactNode;
  color?: 'default' | 'accent1' | 'accent2' | 'inverse';
  size?: 'smaller' | 'normal' | 'larger';
}) {
  const className = mapStyles(styles, {
    align,
    color,
    size,
  });

  return <div className={className}>{children}</div>;
}

export const Typography = memo(TypographyComponent);
