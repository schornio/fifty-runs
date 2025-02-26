import { useEffect, useState } from 'react';
import { Box } from '@/components/atomics/Box';
import Link from 'next/link';
import { PostingImage } from '@/components/atomics/PostingImage';
import { Reaction } from '@prisma/client';
import { Reactions } from '@/components/composed/Reactions';
import { RunningExercise } from '@/components/composed/RunningExercise';
import { Text } from '@/components/atomics/Text';
import { UserLabel } from '@/components/composed/UserLabel';
import { JoinRequestButton } from '@/components/composed/JoinRequestButton/JoinRequestButton';

const { format } = new Intl.DateTimeFormat('de-de', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const { format: formatCurrency } = new Intl.NumberFormat('de-de', {
  currency: 'EUR',
  style: 'currency',
});

export function Posting({
  commentCount,
  date,
  donation,
  id,
  image,
  reactions,
  runningExercise,
  text,
  userImage,
  userName,
  userNameId,
  userGroup,
  userReactionType,
}: {
  commentCount: number;
  date: string;
  donation?: {
    amountInCent: number;
  } | null;
  id: string;
  image?: string | null;
  reactions?: Reaction[];
  runningExercise?: {
    distanceInMeters: number;
    durationInSeconds: number;
  } | null;
  text?: string | null;
  userImage?: string | null;
  userName: string;
  userNameId: string;
  userGroup?: string;
  userReactionType?: string;
}) {
  const [groupId, setGroupId] = useState<string | null>(null);

  useEffect(() => {
    if (!userGroup) return;
    
    const fetchGroupId = async () => {
      try {
        const res = await fetch(`/api/group/by-name/${userGroup}`);
        if (res.ok) {
          const data = await res.json();
          setGroupId(data.id);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Gruppen-ID:', error);
      }
    };

    fetchGroupId();
  }, [userGroup]);

  return (
    <div className="overflow-hidden rounded-xl border border-congress-blue-900">
      <div className="flex items-center justify-start border-b border-congress-blue-900 p-4">
        <UserLabel userImage={userImage} userName={userName} userNameId={userNameId} />

        {userGroup && groupId ? (
          <div className="ml-1 flex items-center gap-1 font-semibold text-congress-blue-900">
            <Link href={`/team/${userGroup}`} className="hover:text-congress-blue-700">
              | {userGroup}
            </Link>
            <JoinRequestButton groupId={groupId} showIcon />
          </div>
        ) : null}

        <div className="ml-4 flex items-center gap-2">
          <Text color="text" fontSize="sub">{format(new Date(date))}</Text>
        </div>
      </div>

      {image ? <PostingImage image={image} /> : undefined}
      {text && text.length > 0 ? (
        <div className="px-8 py-16 text-center text-xl">{text}</div>
      ) : undefined}
      {runningExercise ? <RunningExercise {...runningExercise} /> : undefined}

      {donation ? (
        <Box textAlign="center">
          <Text color="gold" fontWeight="bold" fontSize="heading1">
            {formatCurrency(donation.amountInCent / 100)}
          </Text>
          <br />
          Spende
        </Box>
      ) : undefined}

      <div className="flex flex-col gap-4 bg-neutral-100 p-4">
        <Reactions postingId={id} reactions={reactions} userReactionType={userReactionType} />
        <Box textAlign="center">
          <Link href={`/postings/${id}`}>
            <Text color="primary" fontWeight="bold">
              Kommentare ({commentCount})
            </Text>
          </Link>
        </Box>
      </div>
    </div>
  );
}
