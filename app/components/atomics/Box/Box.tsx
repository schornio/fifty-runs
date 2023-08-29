import { ReactNode, memo } from 'react';
import { Breakpoint } from '@/style/Breakpoint';
import { BreakpointProps } from '@/util/BreakpointProps';
import { Color } from '@/style/Color';
import { Size } from '@/style/Size';
import { mapStyles } from '@/util/mapStyles';
import styles from './Box.module.css';

function BoxComponent({
  children,
  color,
  maxWidth,
  roundedCorners,
  variant,
  ...breakpointProps
}: BreakpointProps<{
  flexGrow?: boolean;
  textAlign?: 'start' | 'center' | 'end';
  padding?: Size;
}> & {
  children?: ReactNode;
  color?: Color;
  maxWidth?: Breakpoint;
  roundedCorners?: boolean;
  variant?: 'outlined' | 'filled';
}) {
  const className = mapStyles(styles, ['default'], {
    color,
    maxWidth,
    roundedCorners,
    variant,
    ...breakpointProps,
  });
  return <div className={className}>{children}</div>;
}

export const Box = memo(BoxComponent);
