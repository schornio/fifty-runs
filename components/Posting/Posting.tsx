import { Box } from '@/components/atomics/Box';
import Image from 'next/image';
import Link from 'next/link';
import { Reaction } from '@prisma/client';
import { Reactions } from '@/components/composed/Reactions';
import { RunningExercise } from '../composed/RunningExercise';
import { Stack } from '@/components/atomics/Stack';
import { Text } from '@/components/atomics/Text';
import { UserLabel } from '@/components/composed/UserLabel';
import styles from './Posting.module.css';

const { format } = new Intl.DateTimeFormat('de-de', {
  dateStyle: 'full',
  timeStyle: 'medium',
});

export function Posting({
  date,
  id,
  image,
  reactions,
  runningExercise,
  text,
  userImage,
  userName,
  userNameId,
  userReactionType,
}: {
  date: string;
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
  userReactionType?: string;
}) {
  return (
    <Box color="primary" roundedCorners={true} variant="outlined">
      <Box padding="double">
        <Stack alignInline="spaceBetween">
          <UserLabel
            userImage={userImage}
            userName={userName}
            userNameId={userNameId}
          />
          <Link href={`/postings/${id}`}>
            <Text color="text" fontSize="sub">
              {format(new Date(date))}
            </Text>
          </Link>
        </Stack>
      </Box>
      {image ? (
        <Image
          alt=""
          className={styles.image}
          height={300}
          src={image}
          width={600}
        />
      ) : undefined}
      {text && text.length > 0 ? (
        <Box textAlign="center" padding="double">
          {text}
        </Box>
      ) : undefined}
      {runningExercise ? (
        <Box padding="double">
          <RunningExercise {...runningExercise} />
        </Box>
      ) : undefined}
      <Box padding="double">
        <Reactions
          postingId={id}
          reactions={reactions}
          userReactionType={userReactionType}
        />
      </Box>
    </Box>
  );
}
