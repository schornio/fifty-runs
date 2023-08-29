import { createSession } from '@/util/server/createSession';
import { prisma } from '@/prisma';
import { redirect } from 'next/navigation';

export async function GET(
  _request: Request,
  {
    params: { emailVerificationToken },
  }: {
    params: { emailVerificationToken: string };
  },
) {
  try {
    if (emailVerificationToken.length === 0) {
      throw new Error('Invalid token');
    }

    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken,
      },
    });

    if (!user) {
      throw new Error('Invalid token');
    }

    await prisma.user.update({
      data: {
        emailVerificationToken: null,
        emailVerified: true,
      },
      where: {
        id: user.id,
      },
    });

    await createSession(user.id);
  } catch {
    return new Response(undefined, { status: 400 });
  }

  redirect('/postings');
}
