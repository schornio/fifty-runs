import { Box } from '@/components/atomics/Box';
import { ProgressBar } from '@/components/atomics/ProgressBar';
import { Stack } from '@/components/atomics/Stack';
import { TableCell } from '@/components/atomics/TableCell';
import { Text } from '@/components/atomics/Text';
import { UserLabel } from '@/components/composed/UserLabel';
import { cache } from 'react';
import { prisma } from '@/prisma';

const getTopUsersByRuns = cache(async () => {
  return await prisma.runningStatistic.findMany({
    orderBy: {
      numberOfRuns: 'desc',
    },
    select: {
      numberOfRuns: true,
      user: {
        select: {
          image: true,
          name: true,
          nameId: true,
        },
      },
    },
    take: 5,
  });
});

const getTopUsersByDistance = cache(async () => {
  return await prisma.runningStatistic.findMany({
    orderBy: {
      distanceInMeters: 'desc',
    },
    select: {
      distanceInMeters: true,
      user: {
        select: {
          image: true,
          name: true,
          nameId: true,
        },
      },
    },
    take: 5,
  });
});

const getTopUsersByDuration = cache(async () => {
  return await prisma.runningStatistic.findMany({
    orderBy: {
      durationInSeconds: 'desc',
    },
    select: {
      durationInSeconds: true,
      user: {
        select: {
          image: true,
          name: true,
          nameId: true,
        },
      },
    },
    take: 5,
  });
});

export default async function LeaderboardPage() {
  const [topUsersByRuns, topUsersByDistance, topUsersByDuration] =
    await Promise.all([
      getTopUsersByRuns(),
      getTopUsersByDistance(),
      getTopUsersByDuration(),
    ]);

  const maxDistanceInMeters = topUsersByDistance[0]?.distanceInMeters ?? 0;
  const maxDurationInSeconds = topUsersByDuration[0]?.durationInSeconds ?? 0;

  return (
    <Box maxWidth="desktop" padding="normal">
      <Stack alignBlock="stretch" direction="column" gap="double">
        <Text textAlign="center">
          <h2>Leaderboard - runs</h2>
        </Text>
        <table>
          <tbody>
            {topUsersByRuns.map(({ numberOfRuns, user }) => (
              <tr key={user.nameId}>
                <TableCell>
                  <UserLabel
                    userImage={user.image}
                    userName={user.name}
                    userNameId={user.nameId}
                  />
                </TableCell>
                <TableCell grow={true}>
                  <ProgressBar value={numberOfRuns / 50}>
                    <Text color="background">
                      <strong>{numberOfRuns} / 50 runs</strong>
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
            {topUsersByDistance.map(({ distanceInMeters, user }) => (
              <tr key={user.nameId}>
                <TableCell>
                  <UserLabel
                    userImage={user.image}
                    userName={user.name}
                    userNameId={user.nameId}
                  />
                </TableCell>
                <TableCell grow={true}>
                  <ProgressBar value={distanceInMeters / maxDistanceInMeters}>
                    <Text color="background">
                      <strong>
                        {Math.round(distanceInMeters / 100) / 10} km
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
            {topUsersByDuration.map(({ durationInSeconds, user }) => (
              <tr key={user.nameId}>
                <TableCell>
                  <UserLabel
                    userImage={user.image}
                    userName={user.name}
                    userNameId={user.nameId}
                  />
                </TableCell>
                <TableCell grow={true}>
                  <ProgressBar value={durationInSeconds / maxDurationInSeconds}>
                    <Text color="background">
                      <strong>
                        {Math.floor(durationInSeconds / 3600)} h{' '}
                        {Math.floor(durationInSeconds / 60) % 60} min
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
