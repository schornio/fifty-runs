import { ReactNode, memo } from 'react';
import { mapStyles } from '@/util/mapStyles';
import styles from './Box.module.css';

function BoxComponent({
  children,
  color = 'default',
  corner,
  maxWidth = 'none',
  padding = 'none',
  variant = 'default',
}: {
  children?: ReactNode;
  color?: 'default' | 'blue' | 'green';
  corner?: '1' | '2';
  maxWidth?: 'none' | 'phone' | 'tablet' | 'desktop';
  padding?: 'none' | '1' | '2';
  variant?: 'default' | 'fill' | 'outline';
}) {
  const className = mapStyles(styles, {
    color,
    corner,
    default: true,
    padding,
    variant,
    width: maxWidth,
  });
  return <div className={className}>{children}</div>;
}

export const Box = memo(BoxComponent);
