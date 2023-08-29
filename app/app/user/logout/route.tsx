import { cookies } from 'next/headers';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { prisma } from '@/prisma';
import { redirect } from 'next/navigation';

export async function GET() {
  const session = await getCurrentSession();

  if (session) {
    prisma.session.delete({ where: { id: session.id } });
  }

  cookies().delete('sessionToken');
  return redirect('/user/login');
}
