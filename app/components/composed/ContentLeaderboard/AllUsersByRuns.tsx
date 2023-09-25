import { ProgressBar } from '@/components/atomics/ProgressBar';
import { UserLabel } from '@/components/composed/UserLabel';
import { cache } from 'react';
import { prisma } from '@/prisma';

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
    take: 5,
  });
});

export default async function AllUsersByRuns() {
  const allUsersByRuns = await getAllUsersByRuns();

  return (
    <div className="w-full max-w-screen-lg py-5">
      <div className="flex flex-col items-stretch gap-10">
        <div className="text-center">
          <h2 className="text-xl font-bold text-congress-blue-900">
            Leaderboard - Läufe
          </h2>
        </div>
        <table className="border-separate border-spacing-x-5">
          <tbody>
            {allUsersByRuns.map(({ numberOfRuns, user }) => (
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
      </div>
    </div>
  );
}
