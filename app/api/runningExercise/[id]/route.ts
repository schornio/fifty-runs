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

    const runningExercise = await prisma.runningExercise.findUnique({
      where: {
        id,
        userId: session.userId,
      },
    });

    if (!runningExercise) {
      throw new Error('Invalid runningExercise');
    }

    if (runningExercise.image) {
      await del(runningExercise.image);
    }

    await prisma.runningExercise.delete({
      where: {
        id: runningExercise.id,
      },
    });

    return new Response();
  } catch {
    return new Response(undefined, { status: 500 });
  }
}
