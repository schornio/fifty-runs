import { compare, hash } from 'bcrypt';
import { changePasswordSchema } from '@/schema/changePassword';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { prisma } from '@/prisma';

const SALT_ROUNDS = 10;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const entities = Object.fromEntries(formData.entries());

    const { newPassword, oldPassword } = changePasswordSchema.parse(entities);

    const session = await getCurrentSession();
    if (!session) {
      throw new Error('Not logged in');
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }

    const passwordMatches = await compare(oldPassword, user.password);
    if (!passwordMatches) {
      throw new Error('Old password is wrong');
    }

    const passwordHash = await hash(newPassword, SALT_ROUNDS);

    await prisma.user.update({
      data: {
        password: passwordHash,
      },
      where: {
        id: user.id,
      },
    });

    return new Response(undefined, { status: 200 });
  } catch {
    return new Response(undefined, { status: 400 });
  }
}
