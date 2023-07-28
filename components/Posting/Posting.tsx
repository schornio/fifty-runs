import { Box } from '@/components/atomics/Box';
import Image from 'next/image';
import { Reactions } from '@/components/Reactions';
import { RunningExercise } from '../RunningExercise';
import { Stack } from '@/components/atomics/Stack';
import { Suspense } from 'react';
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
  runningExercise,
  text,
  userImage,
  userName,
  userNameId,
}: {
  date: string;
  runningExercise?: {
    distanceInMeters: number;
    durationInSeconds: number;
  } | null;
  id: string;
  image?: string | null;
  text?: string | null;
  userImage?: string | null;
  userName: string;
  userNameId: string;
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
          <Text fontSize="sub">{format(new Date(date))}</Text>
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
        <Suspense
          fallback={
            <Box color="primary" textAlign="center">
              ...
            </Box>
          }
        >
          <Reactions postingId={id} />
        </Suspense>
      </Box>
    </Box>
  );
}
