'use client';

import { ReactNode, memo, useCallback, useEffect, useState } from 'react';
import { cn } from '@/util/cn';
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

  return (
    <>
      <button
        className="rounded-full border-2 border-congress-blue-900 px-4 py-2 font-bold text-congress-blue-900 lg:hidden"
        onClick={onButtonMenuClick}
        type="button"
      >
        {menuVisible ? 'Schließen' : 'Menü'}
      </button>
      <div
        className={cn(
          'max-lg:absolute max-lg:inset-0 max-lg:top-full max-lg:hidden',
          {
            'max-lg:block': menuVisible,
          },
        )}
      >
        {children}
      </div>
    </>
  );
}

export const HeaderMenu = memo(HeaderMenuComponent);
