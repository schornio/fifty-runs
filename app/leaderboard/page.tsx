import { Box } from '@/components/atomics/Box';
import { ProgressBar } from '@/components/atomics/ProgressBar';
import { Stack } from '@/components/atomics/Stack';
import { TableCell } from '@/components/atomics/TableCell';
import { Text } from '@/components/atomics/Text';
import { UserLabel } from '@/components/composed/UserLabel';
import { cache } from 'react';
import { donationMultiplierToNumber } from '@/model/donationMultiplierToNumber';
import { prisma } from '@/prisma';

const { format: formatCurrency } = new Intl.NumberFormat('de-de', {
  currency: 'EUR',
  style: 'currency',
});

const getDonationSum = cache(async () => {
  const donations = await prisma.donation.aggregate({
    _sum: {
      amountInCent: true,
    },
  });

  return donations._sum.amountInCent ?? 0;
});

const getAllUsersByRuns = cache(async () => {
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
          runDonationMultiplier: true,
        },
      },
    },
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
  const [dontations, allUsersByRuns, topUsersByDistance, topUsersByDuration] =
    await Promise.all([
      getDonationSum(),
      getAllUsersByRuns(),
      getTopUsersByDistance(),
      getTopUsersByDuration(),
    ]);

  const topUsersByRuns = [...allUsersByRuns].splice(0, 5);
  const donationsByRuns = allUsersByRuns.reduce(
    (sum, { numberOfRuns, user }) => {
      return (
        sum +
        donationMultiplierToNumber(user.runDonationMultiplier ?? 'nothing') *
          numberOfRuns
      );
    },
    0,
  );

  const allDonations = dontations + donationsByRuns;

  const maxDistanceInMeters = topUsersByDistance[0]?.distanceInMeters ?? 0;
  const maxDurationInSeconds = topUsersByDuration[0]?.durationInSeconds ?? 0;

  return (
    <Box maxWidth="desktop" padding="normal">
      <Stack alignBlock="stretch" direction="column" gap="double">
        <Box padding="double" textAlign="center">
          <Text color="gold" fontWeight="bold" fontSize="heading1">
            {formatCurrency(allDonations / 100)}
          </Text>
          <br />
          Spenden gesamt
        </Box>
        <Box textAlign="center">
          <h2>Leaderboard - runs</h2>
        </Box>
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
        <Box textAlign="center">
          <h2>Leaderboard - Distanz</h2>
        </Box>
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
        <Box textAlign="center">
          <h2>Leaderboard - Dauer</h2>
        </Box>
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
