import { getEnvSafe } from '@/util/getEnvSave';
import { prisma } from '@/prisma';

const season = getEnvSafe('SEASON');

export async function POST() {
  await prisma.runningStatistic.deleteMany();

  const allRunningExercises = await prisma.runningExercise.findMany({
    include: {
      posting: true,
    },
    where: {
      posting: {
        season,
      },
    },
  });

  const reducedRunningExercises = new Map<
    string,
    {
      distanceInMeters: number;
      durationInSeconds: number;
      numberOfRuns: number;
    }
  >();

  for (const runningExercise of allRunningExercises) {
    const key = runningExercise.posting.userId;

    if (!reducedRunningExercises.has(key)) {
      reducedRunningExercises.set(key, {
        distanceInMeters: 0,
        durationInSeconds: 0,
        numberOfRuns: 0,
      });
    }

    reducedRunningExercises.get(key)!.distanceInMeters +=
      runningExercise.distanceInMeters ?? 0;
    reducedRunningExercises.get(key)!.durationInSeconds +=
      runningExercise.durationInSeconds ?? 0;
    reducedRunningExercises.get(key)!.numberOfRuns += 1;
  }

  for (const [userId, runningExercise] of Array.from(reducedRunningExercises)) {
    await prisma.runningStatistic.create({
      data: {
        distanceInMeters: runningExercise.distanceInMeters,
        durationInSeconds: runningExercise.durationInSeconds,
        numberOfRuns: runningExercise.numberOfRuns,
        season,
        userId,
      },
    });
  }

  return new Response(null, { status: 200 });
}
