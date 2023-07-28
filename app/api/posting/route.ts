import { getCurrentSession } from '@/util/server/getCurrentSession';
import { postingSchema } from '@/schema/posting';
import { prisma } from '@/prisma';
import { put } from '@/util/server/vercelBlobShim';
import { runningExperciseSchema } from '@/schema/runningExercise';
import { z } from 'zod';

const requestSchema = z.union([postingSchema, runningExperciseSchema]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const entities = Object.fromEntries(formData.entries());
    const posting = requestSchema.parse(entities);

    const session = await getCurrentSession();

    if (!session) {
      throw new Error('Invalid session');
    }

    const { id } = await prisma.posting.create({
      data: {
        date: new Date(),
        text: posting.text,
        userId: session.userId,
        visibility: posting.visibility,
      },
    });

    if (posting.image && posting.image.size > 0) {
      const { url } = await put(posting.image.name, posting.image, {
        access: 'public',
      });

      await prisma.posting.update({
        data: {
          image: url,
        },
        where: {
          id,
        },
      });
    }

    if (posting.type === 'runningExercise') {
      await prisma.runningExercise.create({
        data: {
          distanceInMeters: posting.distanceInMeters,
          durationInSeconds: posting.durationInSeconds,
          postingId: id,
        },
      });

      await prisma.runningStatistic.upsert({
        create: {
          distanceInMeters: posting.distanceInMeters,
          durationInSeconds: posting.durationInSeconds,
          numberOfRuns: 1,
          userId: session.userId,
        },
        update: {
          distanceInMeters: {
            increment: posting.distanceInMeters,
          },
          durationInSeconds: {
            increment: posting.durationInSeconds,
          },
          numberOfRuns: {
            increment: 1,
          },
        },
        where: {
          userId: session.userId,
        },
      });
    }

    return new Response();
  } catch {
    return new Response(null, { status: 400 });
  }
}
