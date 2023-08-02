import { del, put } from '@/util/server/vercelBlobShim';
import { changeUserImageSchema } from '@/schema/changeUserImage';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { prisma } from '@/prisma';

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const entities = Object.fromEntries(formData.entries());
    const { image } = changeUserImageSchema.parse(entities);

    const session = await getCurrentSession();
    if (!session) {
      throw new Error('Invalid session');
    }

    if (image && image.size > 0) {
      const current = await prisma.user.findUnique({
        select: {
          image: true,
        },
        where: {
          id: session.userId,
        },
      });

      const [{ url }] = await Promise.all([
        put(image.name, image, {
          access: 'public',
        }),
        current?.image ? del(current.image) : undefined,
      ]);

      await prisma.user.update({
        data: {
          image: url,
        },
        where: {
          id: session.userId,
        },
      });
    } else {
      const user = await prisma.user.update({
        data: {
          image: null,
        },
        where: {
          id: session.userId,
        },
      });

      const url = user.image;
      if (url) {
        await del(url);
      }
    }

    return new Response();
  } catch {
    return new Response(undefined, { status: 400 });
  }
}
