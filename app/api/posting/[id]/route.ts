import { del } from '@/util/server/vercelBlobShim';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { prisma } from '@/prisma';

export async function DELETE(
  _request: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      throw new Error('Invalid session');
    }

    const posting = await prisma.posting.findUnique({
      include: {
        runningExercise: true,
      },
      where: {
        id,
        userId: session.userId,
      },
    });

    if (!posting) {
      throw new Error('Invalid posting');
    }

    if (posting.image) {
      await del(posting.image);
    }

    await prisma.posting.delete({
      where: {
        id: posting.id,
      },
    });

    if (posting.runningExercise) {
      await prisma.runningStatistic.update({
        data: {
          distanceInMeters: {
            decrement: posting.runningExercise.distanceInMeters,
          },
          durationInSeconds: {
            decrement: posting.runningExercise.durationInSeconds,
          },
          numberOfRuns: {
            decrement: 1,
          },
        },
        where: {
          userId: session.userId,
        },
      });
    }

    return new Response();
  } catch {
    return new Response(undefined, { status: 400 });
  }
}
