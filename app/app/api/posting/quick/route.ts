import { getCurrentSession } from '@/util/server/getCurrentSession';
import { getEnvSafe } from '@/util/getEnvSave';
import { prisma } from '@/prisma';

const season = getEnvSafe('SEASON');

export async function POST() {
  try {
    const session = await getCurrentSession();

    if (!session) {
      throw new Error('Invalid session');
    }

    const runsAlready = await prisma.runningStatistic.findFirst({
      where: {
        season,
        userId: session.userId,
      },
    });

    const { id } = await prisma.posting.create({
      data: {
        date: new Date(),
        season,
        text: `${runsAlready ? runsAlready.numberOfRuns + 1 : 1}. Lauf`,
        userId: session.userId,
        visibility: 'protected',
      },
    });

    await prisma.runningExercise.create({
      data: {
        distanceInMeters: 0,
        durationInSeconds: 0,
        postingId: id,
      },
    });

    await prisma.runningStatistic.upsert({
      create: {
        distanceInMeters: 0,
        durationInSeconds: 0,
        numberOfRuns: 1,
        season,
        userId: session.userId,
      },
      update: {
        numberOfRuns: {
          increment: 1,
        },
      },
      where: {
        season,
        userId: session.userId,
      },
    });

    return new Response();
  } catch (error) {
    return new Response(null, { status: 400 });
  }
}
