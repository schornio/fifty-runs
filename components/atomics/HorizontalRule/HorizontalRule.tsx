import { Color } from '@/style/Color';
import { mapStyles } from '@/util/mapStyles';
import { memo } from 'react';
import styles from './HorizontalRule.module.css';

function HorizontalRuleComponent({
  border = 'thin',
  color = 'primary',
}: {
  border?: 'thin' | 'bold';
  color?: Color;
}) {
  const className = mapStyles(styles, ['default'], { border, color });
  return <hr className={className} />;
}

export const HorizontalRule = memo(HorizontalRuleComponent);
