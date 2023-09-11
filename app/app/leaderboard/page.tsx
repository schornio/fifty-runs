import { ProgressBar } from '@/components/atomics/ProgressBar';
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
    <div className="w-full max-w-screen-lg py-5">
      <div className="flex flex-col items-stretch gap-10">
        <h2 className="p-10 text-center">
          <span className="text-3xl font-bold text-gold-500">
            {formatCurrency(allDonations / 100)}
          </span>
          <br />
          Spenden gesamt
        </h2>
        <div className="text-center">
          <h2 className="text-xl font-bold text-congress-blue-900">
            Leaderboard - runs
          </h2>
        </div>
        <table className="border-separate border-spacing-x-5">
          <tbody>
            {topUsersByRuns.map(({ numberOfRuns, user }) => (
              <tr key={user.nameId}>
                <td>
                  <UserLabel
                    userImage={user.image}
                    userName={user.name}
                    userNameId={user.nameId}
                  />
                </td>
                <td className="w-full">
                  <ProgressBar value={numberOfRuns / 50}>
                    <span className="text-white">
                      <strong>{numberOfRuns} / 50 runs</strong>
                    </span>
                  </ProgressBar>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-center">
          <h2 className="text-xl font-bold text-congress-blue-900">
            Leaderboard - Distanz
          </h2>
        </div>
        <table className="border-separate border-spacing-x-5">
          <tbody>
            {topUsersByDistance.map(({ distanceInMeters, user }) => (
              <tr key={user.nameId}>
                <td>
                  <UserLabel
                    userImage={user.image}
                    userName={user.name}
                    userNameId={user.nameId}
                  />
                </td>
                <td className="w-full">
                  <ProgressBar value={distanceInMeters / maxDistanceInMeters}>
                    <span className="text-white">
                      <strong>
                        {Math.round(distanceInMeters / 100) / 10} km
                      </strong>
                    </span>
                  </ProgressBar>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-center">
          <h2 className="text-xl font-bold text-congress-blue-900">
            Leaderboard - Dauer
          </h2>
        </div>
        <table className="border-separate border-spacing-x-5">
          <tbody>
            {topUsersByDuration.map(({ durationInSeconds, user }) => (
              <tr key={user.nameId}>
                <td>
                  <UserLabel
                    userImage={user.image}
                    userName={user.name}
                    userNameId={user.nameId}
                  />
                </td>
                <td className="w-full">
                  <ProgressBar value={durationInSeconds / maxDurationInSeconds}>
                    <span className="text-white">
                      <strong>
                        {Math.floor(durationInSeconds / 3600)} h{' '}
                        {Math.floor(durationInSeconds / 60) % 60} min
                      </strong>
                    </span>
                  </ProgressBar>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
