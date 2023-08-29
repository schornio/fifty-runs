import { getCurrentSession } from '@/util/server/getCurrentSession';
import { prisma } from '@/prisma';

export async function DELETE(
  _request: Request,
  { params: { id } }: { params: { id: string } }
) {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error('Invalid session');
  }

  await prisma.comment.delete({
    where: {
      id,
      userId: session.userId,
    },
  });

  return new Response();
}
