import { cookies } from 'next/headers';
import { prisma } from '@/prisma';
import { put } from '@/util/server/vercelBlobShim';
import { runningExperciseSchema } from '@/schema/runningExercise';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const entities = Object.fromEntries(formData.entries());
    const { distanceInMeters, durationInSeconds, image, notes, visibility } =
      runningExperciseSchema.parse(entities);

    const sessionToken = cookies().get('sessionToken');

    if (!sessionToken) {
      throw new Error('Invalid session token');
    }

    const session = await prisma.session.findUnique({
      where: {
        token: sessionToken.value,
      },
    });

    if (!session) {
      throw new Error('Invalid session');
    }

    const { id } = await prisma.runningExercise.create({
      data: {
        date: new Date(),
        distanceInMeters,
        durationInSeconds,
        notes,
        userId: session.userId,
        visibility,
      },
    });

    if (image && image.size > 0) {
      const { url } = await put(image.name, image, {
        access: 'public',
      });

      await prisma.runningExercise.update({
        data: {
          image: url,
        },
        where: {
          id,
        },
      });
    }

    return new Response();
  } catch (error) {
    return new Response(null, { status: 400 });
  }
}
