import { commentSchema } from '@/schema/comment';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { prisma } from '@/prisma';

export async function POST(
  request: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const entities = Object.fromEntries(formData.entries());
    const { text } = commentSchema.parse(entities);

    const session = await getCurrentSession();
    if (!session) {
      throw new Error('Invalid session');
    }

    await prisma.comment.create({
      data: {
        date: new Date(),
        postingId: id,
        text,
        userId: session.userId,
      },
    });

    return new Response();
  } catch {
    return new Response(undefined, { status: 400 });
  }
}
