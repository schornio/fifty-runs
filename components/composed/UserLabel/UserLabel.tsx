import { Color } from '@/style/Color';
import Link from 'next/link';
import { Text } from '@/components/atomics/Text';
import { UserImage } from '@/components/atomics/UserImage';
import { mapStyles } from '@/util/mapStyles';
import { memo } from 'react';
import styles from './UserLabel.module.css';

function UserLabelComponent({
  color = 'primary',
  userImage,
  userName,
  userNameId,
}: {
  color?: Color;
  userImage?: string | null;
  userName: string;
  userNameId: string;
}) {
  const href = `/user/${userNameId}`;
  const className = mapStyles(styles, ['default']);
  return (
    <Link className={className} href={href}>
      {userImage ? (
        <UserImage
          color={color}
          image={userImage}
          name={userName}
          size="inline"
        />
      ) : undefined}
      <Text color={color} fontSize="heading3" fontWeight="bold">
        {userName}
      </Text>
    </Link>
  );
}

export const UserLabel = memo(UserLabelComponent);
