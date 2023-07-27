import { Box } from '@/components/atomics/Box';
import { ProgressBar } from '@/components/atomics/ProgressBar';
import { Stack } from '@/components/atomics/Stack';
import { TableCell } from '@/components/atomics/TableCell';
import { Text } from '@/components/atomics/Text';
import { UserLabel } from '@/components/composed/UserLabel';
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

  //   <LeaderboardRow
  //   key={id}
  //   userImage={image}
  //   userName={name}
  //   value={_count.exercises / 50}
  // >
  //   <Text color="background">
  //     <strong>{_count.exercises} / 50 runs</strong>
  //   </Text>
  // </LeaderboardRow>

  return (
    <Box maxWidth="desktop" padding="normal">
      <Stack alignBlock="stretch" direction="column" gap="double">
        <Text textAlign="center">
          <h2>Leaderboard - runs</h2>
        </Text>
        <table>
          <tbody>
            {topUsersRuns.map(({ _count, id, image, name }) => (
              <tr key={id}>
                <TableCell>
                  <UserLabel userName={name} userImage={image} />
                </TableCell>
                <TableCell grow={true}>
                  <ProgressBar value={_count.exercises / 50}>
                    <Text color="background">
                      <strong>{_count.exercises} / 50 runs</strong>
                    </Text>
                  </ProgressBar>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
        <Text textAlign="center">
          <h2>Leaderboard - Distanz</h2>
        </Text>
        <table>
          <tbody>
            {topDistance.map(({ _sum, userId }) => (
              <tr key={userId}>
                <TableCell>
                  <UserLabel
                    userName={
                      topUserDistance.find(({ id }) => id === userId)?.name ??
                      ''
                    }
                    userImage={
                      topUserDistance.find(({ id }) => id === userId)?.image
                    }
                  />
                </TableCell>
                <TableCell grow={true}>
                  <ProgressBar
                    value={(_sum.distanceInMeters ?? 0) / maxDistance}
                  >
                    <Text color="background">
                      <strong>
                        {Math.round((_sum.distanceInMeters ?? 0) / 100) / 10} km
                      </strong>
                    </Text>
                  </ProgressBar>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
        <Text textAlign="center">
          <h2>Leaderboard - Dauer</h2>
        </Text>
        <table>
          <tbody>
            {topDuration.map(({ _sum, userId }) => (
              <tr key={userId}>
                <TableCell>
                  <UserLabel
                    userName={
                      topUserDuration.find(({ id }) => id === userId)?.name ??
                      ''
                    }
                    userImage={
                      topUserDuration.find(({ id }) => id === userId)?.image
                    }
                  />
                </TableCell>
                <TableCell grow={true}>
                  <ProgressBar
                    value={(_sum.durationInSeconds ?? 0) / maxDuration}
                  >
                    <Text color="background">
                      <strong>
                        {Math.floor((_sum.durationInSeconds ?? 0) / 3600)} h{' '}
                        {Math.floor((_sum.durationInSeconds ?? 0) / 60) % 60}{' '}
                        min
                      </strong>
                    </Text>
                  </ProgressBar>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </Stack>
    </Box>
  );
}
