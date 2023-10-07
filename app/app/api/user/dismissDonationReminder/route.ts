import { getCurrentSession } from '@/util/server/getCurrentSession';
import { prisma } from '@/prisma';

export async function POST() {
  const session = await getCurrentSession();

  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }

  const runDonationMultiplierAskAgain = new Date();
  runDonationMultiplierAskAgain.setDate(
    runDonationMultiplierAskAgain.getDate() + 14,
  );

  await prisma.user.update({
    data: {
      runDonationMultiplierAskAgain,
    },
    where: {
      id: session.userId,
    },
  });

  return new Response();
}
