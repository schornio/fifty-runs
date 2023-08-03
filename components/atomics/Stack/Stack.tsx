import { ReactNode, memo } from 'react';
import { BreakpointProps } from '@/util/BreakpointProps';
import { Size } from '@/style/Size';
import { mapStyles } from '@/util/mapStyles';
import styles from './Stack.module.css';

function StackComponent({
  children,
  ...breakpointProps
}: BreakpointProps<{
  alignBlock?: 'start' | 'center' | 'end' | 'stretch';
  alignInline?: 'start' | 'center' | 'end' | 'spaceBetween' | 'spaceAround';
  direction?: 'row' | 'column';
  gap?: Size;
  layout?: '1' | '2' | '3' | '1x2' | '2x1';
}> & {
  children?: ReactNode;
}) {
  const className = mapStyles(styles, ['default'], breakpointProps);
  return <div className={className}>{children}</div>;
}

export const Stack = memo(StackComponent);
