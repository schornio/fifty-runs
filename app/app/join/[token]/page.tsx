// app/join/[token]/page.tsx
import { redirect } from 'next/navigation';
import { prisma } from '@/prisma';
import { getCurrentSession } from '@/util/server/getCurrentSession';

interface JoinPageProps {
  params: {
    token: string;
  };
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { token } = params;

  const session = await getCurrentSession();
  if (!session) {
    redirect(`/user/login?redirect=/join/${token}`);
  }

  const invitation = await prisma.groupInvitation.findUnique({
    where: { token },
  });

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Ungültiger Einladungscode.</p>
      </div>
    );
  }

  if (invitation.usedAt) {
    const group = await prisma.group.findUnique({
      where: { id: invitation.groupId },
      include: { users: true },
    });
    if (group && group.users.some(user => user.id === session.user.id)) {
      redirect(`/team/${group.nameId}`);
    } else {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p>Sorry, der Einladungscode wurde bereits verwendet.</p>
        </div>
      );
    }
  }


  const group = await prisma.group.findUnique({
    where: { id: invitation.groupId },
    include: { users: true },
  });
  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Gruppe nicht gefunden.</p>
      </div>
    );
  }

  if (group.users.some(user => user.id === session.user.id)) {
    if (!invitation.usedAt) {
      await prisma.groupInvitation.update({
        where: { token },
        data: { usedAt: new Date() },
      });
    }
    redirect(`/team/${group.nameId}`);
  }

  await prisma.group.update({
    where: { id: invitation.groupId },
    data: { users: { connect: { id: session.user.id } } },
  });

  await prisma.groupInvitation.update({
    where: { token },
    data: { usedAt: new Date() },
  });

  redirect(`/team/${group.nameId}`);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Beitritt wird verarbeitet…</p>
    </div>
  );
}
