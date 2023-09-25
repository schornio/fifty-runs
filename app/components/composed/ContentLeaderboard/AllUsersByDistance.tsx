import { ProgressBar } from '@/components/atomics/ProgressBar';
import { UserLabel } from '@/components/composed/UserLabel';
import { cache } from 'react';
import { prisma } from '@/prisma';

const getAllUsersByDistance = cache(async () => {
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

export default async function AllUserByDistance() {
  const allUsersByDistance = await getAllUsersByDistance();

  const maxDistanceInMeters = allUsersByDistance[0]?.distanceInMeters ?? 0;

  return (
    <div className="w-full max-w-screen-lg py-5">
      <div className="flex flex-col items-stretch gap-10">
        <div className="text-center">
          <h2 className="text-xl font-bold text-congress-blue-900">
            Leaderboard - Distanz
          </h2>
        </div>
        <table className="border-separate border-spacing-x-5">
          <tbody>
            {allUsersByDistance.map(({ distanceInMeters, user }) => (
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
      </div>
    </div>
  );
}
