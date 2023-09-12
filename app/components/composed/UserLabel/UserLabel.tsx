import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/util/cn';
import { memo } from 'react';

function UserLabelComponent({
  userImage,
  userName,
  userNameId,
}: {
  userImage?: string | null;
  userName: string;
  userNameId: string;
}) {
  const href = `/user/${userNameId}`;
  return (
    <Link className="flex items-center gap-2" href={href}>
      {userImage ? (
        <Image
          alt={userName}
          className={cn('rounded-full border-2 border-congress-blue-900')}
          height={40}
          src={userImage}
          width={40}
        />
      ) : undefined}
      <div className="font-semibold text-congress-blue-900">{userName}</div>
    </Link>
  );
}

export const UserLabel = memo(UserLabelComponent);
