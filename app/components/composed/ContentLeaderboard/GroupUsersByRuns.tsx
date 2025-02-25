import { ProgressBar } from '@/components/atomics/ProgressBar';
import { UserLabel } from '@/components/composed/UserLabel';
import { cache } from 'react';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { prisma } from '@/prisma';
import ViewTeam from '@/components/composed/ViewTeam/ViewTeam';

const season = process.env.SEASON;

const getGroupUsersByRuns = cache(async (groupId: string) => {
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
    where: {
      season,
      user: {
        groupId,
      },
    },
  });
});

export default async function GroupUsersByRuns() {
  const session = await getCurrentSession();
  const userId = session?.userId;

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    include: {
      group: true,
    },
    where: {
      id: userId,
    },
  });

  const group = user?.group;

  if (!group) {
    return null;
  }

  const topGroupUsersByRuns = await getGroupUsersByRuns(group.id);

  return (
    <div className="w-full max-w-screen-lg py-5">
      <div className="flex flex-col items-stretch gap-10">
        <div className="text-center">
          <h2 className="text-xl font-bold text-congress-blue-900">
            Leaderboard {group.name} - Läufe
          </h2>
          <div className="mt-2">
            <ViewTeam teamName={group.nameId} />
          </div>
        </div>
        <table className="border-separate border-spacing-x-5">
          <tbody>
            {topGroupUsersByRuns.map(({ numberOfRuns, user: thisUser }) => (
              <tr key={thisUser.nameId}>
                <td>
                  <UserLabel
                    userImage={thisUser.image}
                    userName={thisUser.name}
                    userNameId={thisUser.nameId}
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
