import { createReactionSchema } from '@/schema/createReaction';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { prisma } from '@/prisma';

export async function PUT(
  request: Request,
  { params: { id: exerciseId } }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const entities = Object.fromEntries(formData.entries());
    const { type } = createReactionSchema.parse(entities);

    const session = await getCurrentSession();
    if (!session) {
      throw new Error('Invalid session');
    }

    await prisma.reaction.upsert({
      create: {
        exerciseId,
        type,
        userId: session.userId,
      },
      update: {
        type,
      },
      where: {
        // eslint-disable-next-line camelcase
        userId_exerciseId: {
          exerciseId,
          userId: session.userId,
        },
      },
    });

    return new Response();
  } catch {
    return new Response(undefined, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params: { id: exerciseId } }: { params: { id: string } }
) {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error('Invalid session');
  }

  await prisma.reaction.delete({
    where: {
      // eslint-disable-next-line camelcase
      userId_exerciseId: {
        exerciseId,
        userId: session.userId,
      },
    },
  });

  return new Response();
}
