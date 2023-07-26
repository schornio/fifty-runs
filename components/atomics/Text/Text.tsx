import { ReactNode, memo } from 'react';
import { BreakpointProps } from '@/util/BreakpointProps';
import { Color } from '@/style/Color';
import { FontSize } from '@/style/FontSize';
import { FontWeight } from '@/style/FontWeight';
import { mapStyles } from '@/util/mapStyles';
import styles from './Text.module.css';

function TextComponent({
  children,
  color = 'text',
  ...breakpointProps
}: BreakpointProps<{
  fontSize?: FontSize;
  fontWeight?: FontWeight;
  textAlign?: 'start' | 'center' | 'end';
}> & {
  children?: ReactNode;
  color?: Color;
}) {
  const className = mapStyles(styles, {
    color,
    ...breakpointProps,
  });
  return <span className={className}>{children}</span>;
}

export const Text = memo(TextComponent);
