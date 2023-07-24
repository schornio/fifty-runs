import { createSession } from '@/util/server/createSession';
import { hash } from 'bcrypt';
import { prisma } from '@/prisma';
import { put } from '@/util/server/vercelBlobShim';
import { registerSchema } from '@/schema/register';

const SALT_ROUNDS = 10;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const entities = Object.fromEntries(formData.entries());
    const {
      email,
      image,
      name,
      password: passwordPlain,
    } = registerSchema.parse(entities);

    const password = await hash(passwordPlain, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });

    if (image && image.size > 0) {
      const { url } = await put(image.name, image, {
        access: 'public',
      });

      await prisma.user.update({
        data: {
          image: url,
        },
        where: {
          id: user.id,
        },
      });
    }

    await createSession(user.id);

    return new Response();
  } catch {
    return new Response(undefined, { status: 400 });
  }
}
