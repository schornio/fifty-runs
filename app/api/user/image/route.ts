import { del, put } from '@/util/server/vercelBlobShim';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { prisma } from '@/prisma';

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      throw new Error('Invalid session');
    }

    const formData = await request.formData();

    const imageData = formData.get('image');
    if (imageData instanceof Blob && imageData.size > 0) {
      const { url } = await put(imageData.name, imageData, {
        access: 'public',
      });

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
