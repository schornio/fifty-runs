import { ProgressBar } from '@/components/atomics/ProgressBar';
import { UserLabel } from '@/components/composed/UserLabel';
import { cache } from 'react';
import { prisma } from '@/prisma';

const getAllUsersByDuration = cache(async () => {
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

export default async function AllUsersByDuration() {
  const allUsersByDuration = await getAllUsersByDuration();

  const maxDurationInSeconds = allUsersByDuration[0]?.durationInSeconds ?? 0;

  return (
    <div className="w-full max-w-screen-lg py-5">
      <div className="flex flex-col items-stretch gap-10">
        <div className="text-center">
          <h2 className="text-xl font-bold text-congress-blue-900">
            Leaderboard - Dauer
          </h2>
        </div>
        <table className="border-separate border-spacing-x-5">
          <tbody>
            {allUsersByDuration.map(({ durationInSeconds, user }) => (
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
