import { Box } from '@/components/atomics/Box';
import Image from 'next/image';
import { Reactions } from '@/components/Reactions';
import { Stack } from '@/components/atomics/Stack';
import { Suspense } from 'react';
import { Text } from '@/components/atomics/Text';
import { UserLabel } from '@/components/composed/UserLabel';
import styles from './RunningExercise.module.css';

const { format } = new Intl.DateTimeFormat('de-de', {
  dateStyle: 'full',
  timeStyle: 'medium',
});

export function RunningExercise({
  date,
  distanceInMeters,
  durationInSeconds,
  id,
  image,
  notes,
  userImage,
  userName,
}: {
  date: string;
  distanceInMeters: number;
  durationInSeconds: number;
  id: string;
  image?: string | null;
  notes?: string | null;
  userImage?: string | null;
  userName: string;
}) {
  const distanceKilometers = Math.floor(distanceInMeters / 1000);
  const distanceMeters = distanceInMeters % 1000;

  const durationHours = Math.floor(durationInSeconds / 3600);
  const durationMinutes = Math.floor((durationInSeconds % 3600) / 60);
  const durationSeconds = durationInSeconds % 60;

  return (
    <Box color="primary" roundedCorners={true} variant="outlined">
      <Box padding="double">
        <Stack alignInline="spaceBetween">
          <UserLabel userImage={userImage} userName={userName} />
          <Text fontSize="sub" textAlign="end">
            {format(new Date(date))}
          </Text>
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
      {notes && notes.length > 0 ? (
        <Box padding="double">
          <Text textAlign="center" fontSize="sub">
            {notes}{' '}
          </Text>
        </Box>
      ) : undefined}
      <Box padding="double">
        <Text textAlign="center" fontSize="sub">
          Distanz:{' '}
          <strong>
            {distanceKilometers > 0 ? `${distanceKilometers} km` : undefined}{' '}
            {distanceMeters > 0 ? `${distanceMeters} m` : undefined}
          </strong>
          Dauer:{' '}
          <strong>
            {durationHours > 0 ? `${durationHours} h` : undefined}{' '}
            {durationMinutes > 0 ? `${durationMinutes} min` : undefined}{' '}
            {durationSeconds > 0 ? `${durationSeconds} s` : undefined}
          </strong>
        </Text>
      </Box>
      <Box padding="double">
        <Suspense
          fallback={
            <Text color="primary" textAlign="center">
              ...
            </Text>
          }
        >
          <Reactions exerciseId={id} />
        </Suspense>
      </Box>
    </Box>
  );
}
