import { ReactNode, memo } from 'react';
import { Color } from '@/style/Color';
import { mapStyles } from '@/util/mapStyles';
import styles from './ProgressBar.module.css';

function ProgressBarComponent({
  color = 'primary',
  children,
  value = 0,
}: {
  children?: ReactNode;
  color?: Color;
  value?: number;
}) {
  const className = mapStyles(styles, ['progress'], { color });
  const progress = Math.min(Math.max(value, 0), 1);
  return (
    <div className={styles.container}>
      <div
        className={className}
        style={{ '--progress': progress } as any}
      ></div>
      {children ? <div className={styles.children}>{children}</div> : undefined}
    </div>
  );
}

export const ProgressBar = memo(ProgressBarComponent);
