import { NextResponse } from 'next/server';
import { donationSchema } from '@/schema/donation';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { getEnvSafe } from '@/util/getEnvSave';
import { getPostings } from '@/model/posting/getPostings';
import { postingSchema } from '@/schema/posting';
import { prisma } from '@/prisma';
import { put } from '@vercel/blob';
import { runningExperciseSchema } from '@/schema/runningExercise';
import { z } from 'zod';

const season = getEnvSafe('SEASON');

export async function GET(request: Request) {
  const url = new URL(request.url);
  const from = url.searchParams.get('from') ?? undefined;

  const session = await getCurrentSession();
  const postings = await getPostings({ from, session });

  return NextResponse.json(postings);
}

const requestSchema = z.union([
  postingSchema,
  runningExperciseSchema,
  donationSchema,
]);

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
        season,
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
          season,
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
          season,
          userId: session.userId,
        },
      });
    }

    if (posting.type === 'donation') {
      await prisma.donation.create({
        data: {
          amountInCent: posting.amountInCent,
          postingId: id,
        },
      });
    }

    return new Response();
  } catch {
    return new Response(null, { status: 400 });
  }
}
