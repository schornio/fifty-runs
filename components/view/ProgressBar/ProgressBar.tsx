import { ReactNode, memo } from 'react';
import styles from './ProgressBar.module.css';

function ProgressBarComponent({
  children,
  value = 0,
}: {
  children?: ReactNode;
  value?: number;
}) {
  const progress = Math.min(Math.max(value, 0), 1);
  return (
    <div className={styles.container}>
      <div
        className={styles.progress}
        style={{ '--progress': progress } as any}
      ></div>
      {children ? <div className={styles.children}>{children}</div> : undefined}
    </div>
  );
}

export const ProgressBar = memo(ProgressBarComponent);
