import { Box } from '@/components/view/Box';
import { LeaderboardRow } from '@/components/LeaderboardRow';
import { Stack } from '@/components/view/Stack';
import { Typography } from '@/components/view/Typography';
import { prisma } from '@/prisma';

export default async function LeaderboardPage() {
  const topUsersRuns = await prisma.user.findMany({
    orderBy: {
      exercises: {
        _count: 'desc',
      },
    },
    select: {
      _count: {
        select: {
          exercises: true,
        },
      },
      id: true,
      image: true,
      name: true,
    },
    take: 5,
  });

  const topDistance = await prisma.runningExercise.groupBy({
    _sum: {
      distanceInMeters: true,
    },
    by: ['userId'],
    orderBy: {
      _sum: {
        distanceInMeters: 'desc',
      },
    },
    take: 5,
  });
  const topUserDistance = await prisma.user.findMany({
    select: {
      id: true,
      image: true,
      name: true,
    },
    where: {
      id: {
        in: topDistance.map(({ userId }) => userId),
      },
    },
  });
  const maxDistance = topDistance.reduce(
    (max, { _sum }) =>
      max < (_sum.distanceInMeters ?? 0) ? _sum.distanceInMeters ?? 0 : max,
    0
  );

  const topDuration = await prisma.runningExercise.groupBy({
    _sum: {
      durationInSeconds: true,
    },
    by: ['userId'],
    orderBy: {
      _sum: {
        durationInSeconds: 'desc',
      },
    },
    take: 5,
  });
  const topUserDuration = await prisma.user.findMany({
    select: {
      id: true,
      image: true,
      name: true,
    },
    where: {
      id: {
        in: topDuration.map(({ userId }) => userId),
      },
    },
  });
  const maxDuration = topDuration.reduce(
    (max, { _sum }) =>
      max < (_sum.durationInSeconds ?? 0) ? _sum.durationInSeconds ?? 0 : max,
    0
  );

  return (
    <Box maxWidth="desktop" padding="1">
      <Stack alignBlock="stretch" gap="2">
        <Typography align="center">
          <h2>Leaderboard - runs</h2>
        </Typography>
        <table>
          <tbody>
            {topUsersRuns.map(({ _count, id, image, name }) => (
              <LeaderboardRow
                key={id}
                userImage={image}
                userName={name}
                value={_count.exercises / 50}
              >
                <Typography color="inverse">
                  <strong>{_count.exercises} / 50 runs</strong>
                </Typography>
              </LeaderboardRow>
            ))}
          </tbody>
        </table>
        <Typography align="center">
          <h2>Leaderboard - Distanz</h2>
        </Typography>
        <table>
          <tbody>
            {topDistance.map(({ _sum, userId }) => (
              <LeaderboardRow
                key={userId}
                userName={
                  topUserDistance.find(({ id }) => id === userId)?.name ?? ''
                }
                userImage={
                  topUserDistance.find(({ id }) => id === userId)?.image
                }
                value={(_sum.distanceInMeters ?? 0) / maxDistance}
              >
                <Typography color="inverse">
                  <strong>
                    {Math.round((_sum.distanceInMeters ?? 0) / 100) / 10} km
                  </strong>
                </Typography>
              </LeaderboardRow>
            ))}
          </tbody>
        </table>
        <Typography align="center">
          <h2>Leaderboard - Dauer</h2>
        </Typography>
        <table>
          <tbody>
            {topDuration.map(({ _sum, userId }) => (
              <LeaderboardRow
                key={userId}
                userName={
                  topUserDuration.find(({ id }) => id === userId)?.name ?? ''
                }
                userImage={
                  topUserDuration.find(({ id }) => id === userId)?.image
                }
                value={(_sum.durationInSeconds ?? 0) / maxDuration}
              >
                <Typography color="inverse">
                  <strong>
                    {Math.floor((_sum.durationInSeconds ?? 0) / 3600)} h{' '}
                    {Math.floor((_sum.durationInSeconds ?? 0) / 60) % 60} min
                  </strong>
                </Typography>
              </LeaderboardRow>
            ))}
          </tbody>
        </table>
      </Stack>
    </Box>
  );
}
