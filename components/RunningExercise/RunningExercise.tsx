import { Box } from '@/components/view/Box';
import Image from 'next/image';
import { Reactions } from '@/components/Reactions';
import { Stack } from '@/components/view/Stack';
import { Typography } from '@/components/view/Typography';
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
    <Box color="blue" corner="2" variant="outline">
      <Box padding="2">
        <Stack alignInline="space-between" direction="horizontal">
          <Stack alignBlock="center" direction="horizontal" gap="1">
            {userImage ? (
              <Image
                alt=""
                className={styles['user-image']}
                height={30}
                src={userImage}
                width={30}
              />
            ) : undefined}
            <Typography size="larger">
              <strong>{userName}</strong>
            </Typography>
          </Stack>
          <Typography align="right" size="smaller">
            {format(new Date(date))}
          </Typography>
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
        <Box padding="2">
          <Typography align="center" size="larger">
            {notes}{' '}
          </Typography>
        </Box>
      ) : undefined}
      <Box padding="2">
        <Typography align="center" size="larger">
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
        </Typography>
      </Box>
      <Box padding="2">
        <Reactions exerciseId={id} />
      </Box>
    </Box>
  );
}
