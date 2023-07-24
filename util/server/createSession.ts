import { cookies } from 'next/headers';
import { prisma } from '@/prisma';
import { randomBytes } from 'crypto';

export async function createSession(userId: string) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const token = randomBytes(64).toString('hex');

  await prisma.session.create({
    data: {
      expiresAt,

      token,
      userId,
    },
  });

  cookies().set('sessionToken', token, {
    expires: expiresAt,
  });
}
