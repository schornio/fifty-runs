import { Box } from '@/components/atomics/Box';

export function RunningExercise({
  distanceInMeters,
  durationInSeconds,
}: {
  distanceInMeters: number;
  durationInSeconds: number;
}) {
  const distanceKilometers = Math.floor(distanceInMeters / 1000);
  const distanceMeters = distanceInMeters % 1000;

  const durationHours = Math.floor(durationInSeconds / 3600);
  const durationMinutes = Math.floor((durationInSeconds % 3600) / 60);
  const durationSeconds = durationInSeconds % 60;

  return (
    <Box textAlign="center">
      Distanz:{' '}
      <strong>
        {distanceKilometers > 0 ? `${distanceKilometers} km` : undefined}{' '}
        {distanceMeters > 0 ? `${distanceMeters} m` : undefined}{' '}
      </strong>
      Dauer:{' '}
      <strong>
        {durationHours > 0 ? `${durationHours} h` : undefined}{' '}
        {durationMinutes > 0 ? `${durationMinutes} min` : undefined}{' '}
        {durationSeconds > 0 ? `${durationSeconds} s` : undefined}{' '}
      </strong>
    </Box>
  );
}
