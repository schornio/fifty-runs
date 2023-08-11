import { hash } from 'bcrypt';
import { prisma } from '@/prisma';
import { resetPasswordSchema } from '@/schema/resetPassword';

const SALT_ROUNDS = 10;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const entities = Object.fromEntries(formData.entries());

    const { newPassword, passwordResetToken } =
      resetPasswordSchema.parse(entities);

    const password = await hash(newPassword, SALT_ROUNDS);

    const user = await prisma.user.updateMany({
      data: {
        password,
        passwordResetToken: null,
        passwordResetTokenExpiry: null,
      },
      where: {
        passwordResetToken,
        passwordResetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return new Response(undefined, { status: 200 });
  } catch {
    return new Response(undefined, { status: 400 });
  }
}
