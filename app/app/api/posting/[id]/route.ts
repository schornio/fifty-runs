import { del } from '@vercel/blob';
import { donationSchema } from '@/schema/donation';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { postingSchema } from '@/schema/posting';
import { prisma } from '@/prisma';
import { runningExperciseSchema } from '@/schema/runningExercise';
import { z } from 'zod';

const requestSchema = z.union([
  postingSchema,
  runningExperciseSchema,
  donationSchema,
]);

export async function PUT(
  request: Request,
  { params: { id } }: { params: { id: string } },
) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      throw new Error('Invalid session');
    }

    const posting = await prisma.posting.findUnique({
      include: {
        donation: true,
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

    const formData = await request.formData();
    const entities = Object.fromEntries(formData.entries());
    const postingUpdates = requestSchema.parse(entities);

    if (
      (postingUpdates.type !== 'donation' && posting.donation) ||
      (postingUpdates.type !== 'runningExercise' && posting.runningExercise)
    ) {
      throw new Error('Posting type missmatch');
    }

    await prisma.posting.update({
      data: {
        text: postingUpdates.text,
        visibility: postingUpdates.visibility,
      },
      where: {
        id: posting.id,
      },
    });

    if (postingUpdates.type === 'runningExercise' && posting.runningExercise) {
      await prisma.runningExercise.update({
        data: {
          distanceInMeters: postingUpdates.distanceInMeters,
          durationInSeconds: postingUpdates.durationInSeconds,
        },
        where: {
          postingId: posting.id,
        },
      });

      await prisma.runningStatistic.upsert({
        create: {
          distanceInMeters: postingUpdates.distanceInMeters,
          durationInSeconds: postingUpdates.durationInSeconds,
          numberOfRuns: 1,
          userId: session.userId,
        },
        update: {
          distanceInMeters: {
            increment:
              postingUpdates.distanceInMeters -
              posting.runningExercise.distanceInMeters,
          },
          durationInSeconds: {
            increment:
              postingUpdates.durationInSeconds -
              posting.runningExercise.durationInSeconds,
          },
        },
        where: {
          userId: session.userId,
        },
      });
    }

    if (postingUpdates.type === 'donation' && posting.donation) {
      await prisma.donation.update({
        data: {
          amountInCent:
            postingUpdates.amountInCent - posting.donation.amountInCent,
        },
        where: {
          postingId: id,
        },
      });
    }

    return new Response();
  } catch {
    return new Response(undefined, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params: { id } }: { params: { id: string } },
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
