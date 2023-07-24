import { ReactNode, memo } from 'react';
import { mapStyles } from '@/util/mapStyles';
import styles from './Stack.module.css';

function StackComponent({
  alignBlock = 'start',
  alignInline = 'start',
  children,
  direction = 'vertical',
  directionOnMobile,
  gap = 'none',
}: {
  alignBlock?: 'start' | 'center' | 'end' | 'stretch';
  alignInline?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
  children?: ReactNode;
  direction?: 'horizontal' | 'vertical';
  directionOnMobile?: 'horizontal' | 'vertical';
  gap?: 'none' | '1' | '2';
}) {
  const className = mapStyles(styles, {
    ['align-block']: alignBlock,
    ['align-inline']: alignInline,
    default: true,
    direction,
    ['direction-on-mobile']: directionOnMobile ?? direction,
    gap,
  });
  return <div className={className}>{children}</div>;
}

export const Stack = memo(StackComponent);
