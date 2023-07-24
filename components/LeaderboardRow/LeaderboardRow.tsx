import Image from 'next/image';
import { ProgressBar } from '../view/ProgressBar';
import { ReactNode } from 'react';
import styles from './LeaderboardRow.module.css';

export function LeaderboardRow({
  children,
  userImage,
  userName,
  value,
}: {
  children: ReactNode;
  userImage?: string | null;
  userName: string;
  value: number;
}) {
  return (
    <tr>
      <td>
        {userImage ? (
          <Image
            alt=""
            className={styles['user-image']}
            height={30}
            src={userImage}
            width={30}
          />
        ) : undefined}
        {userName}
      </td>
      <td className={styles['column-main']}>
        <ProgressBar value={value}>{children}</ProgressBar>
      </td>
    </tr>
  );
}
