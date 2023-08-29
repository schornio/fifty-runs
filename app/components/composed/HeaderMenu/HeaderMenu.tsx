'use client';

import { ReactNode, memo, useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/atomics/Button';
import { mapStyles } from '@/util/mapStyles';
import styles from './HeaderMenu.module.css';
import { usePathname } from 'next/navigation';

function HeaderMenuComponent({ children }: { children?: ReactNode }) {
  const pathname = usePathname();
  const [menuVisible, setMenuVisible] = useState(false);

  const onButtonMenuClick = useCallback(() => {
    setMenuVisible((previousState) => !previousState);
  }, []);

  // Close menu when pathname changes
  useEffect(() => {
    setMenuVisible(false);
  }, [pathname]);

  const menuClassName = mapStyles(styles, ['menu'], {
    menuVisible,
  });

  return (
    <>
      <div className={styles.button}>
        <Button onClick={onButtonMenuClick} type="button">
          {menuVisible ? 'Schließen' : 'Menü'}
        </Button>
      </div>
      <div className={menuClassName}>{children}</div>
    </>
  );
}

export const HeaderMenu = memo(HeaderMenuComponent);

function HeaderMenuWrapperComponent({ children }: { children?: ReactNode }) {
  const className = mapStyles(styles, ['wrapper']);
  return <div className={className}>{children}</div>;
}

export const HeaderMenuWrapper = memo(HeaderMenuWrapperComponent);
