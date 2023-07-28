import { getCurrentSession } from '@/util/server/getCurrentSession';
import { prisma } from '@/prisma';
import { redirect } from 'next/navigation';

export default async function UserPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
  });

  if (!user) {
    redirect('/login');
  }

  redirect(`/user/${user.nameId}`);
}
