'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../Button';
import Image from 'next/image';
import Link from 'next/link';
import { mapStyles } from '@/util/mapStyles';
import styles from './HeaderMenu.module.css';

export function HeaderMenu({
  userName,
  userImage,
}: {
  userName?: string;
  userImage?: string;
}) {
  const pathname = usePathname();
  const { refresh, push } = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = useCallback(() => {
    setMenuVisible((currentMenuVisible) => !currentMenuVisible);
  }, []);

  const onLogoutClick = useCallback(() => {
    setMenuVisible(false);
    push('/user/logout');
    refresh();
  }, [refresh, push]);

  useEffect(() => {
    setMenuVisible(false);
  }, [pathname]);

  const linkStyles = mapStyles(styles, {
    links: true,
    ['links-visible']: menuVisible,
  });

  return (
    <>
      <div className={styles.button}>
        <Button onClick={toggleMenu}>
          {menuVisible ? 'Schließen' : 'Menü'}
        </Button>
      </div>
      <div className={linkStyles}>
        {userName ? (
          <>
            <Link href="/leaderboard">Leaderboard</Link>
            <Link href="/postings">Beiträge</Link>
            {userImage ? (
              <Link className={styles['user-link']} href="/user">
                {userName}
                <Image
                  alt=""
                  className={styles['user-image']}
                  height={40}
                  src={userImage}
                  width={40}
                />
              </Link>
            ) : undefined}
            <div className={styles['user-logout']}>
              <Button onClick={onLogoutClick} variant="outline">
                Abmelden
              </Button>
            </div>
          </>
        ) : (
          <>
            <Link href="/leaderboard">Leaderboard</Link>
            <Link href="/postings">Beiträge</Link>
            <Link href="/user/login">Anmelden</Link>
            <Link href="/user/register">Registrieren</Link>
          </>
        )}
      </div>
    </>
  );
}
