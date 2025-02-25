import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { resend } from '@/util/mail';
import { GroupJoinRequestEmail } from '@/components/mail/GroupJoinRequestEmail';

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ error: 'Einladungstoken erforderlich' }, { status: 400 });
    }

    const invitation = await prisma.groupInvitation.findUnique({
      where: { token },
    });
    if (!invitation) {
      return NextResponse.json({ error: 'Ungültiger Einladungscode' }, { status: 404 });
    }

    // Hole die Gruppe inklusive Admin-Informationen
    const group = await prisma.group.findUnique({
      where: { id: invitation.groupId },
      include: { admin: true },
    });
    if (!group) {
      return NextResponse.json({ error: 'Gruppe nicht gefunden' }, { status: 404 });
    }

    // Füge den Benutzer der Gruppe hinzu
    await prisma.group.update({
      where: { id: invitation.groupId },
      data: { users: { connect: { id: session.user.id } } },
    });

    // Lösche den Einladungseintrag
    await prisma.groupInvitation.delete({ where: { token } });

    // Sende eine E-Mail an den Admin der Gruppe, wenn eine E-Mail-Adresse vorhanden ist
    if (group.admin && group.admin.email) {
      await resend.emails.send({
        from: 'noreply@app.50runs.com',
        to: group.admin.email,
        subject: `Neue Beitrittsanfrage zur Gruppe "${group.name}"`,
        react: GroupJoinRequestEmail({
          adminName: group.admin.name,
          userName: session.user.name,
          groupName: group.name,
        }),
      });
    }

    return NextResponse.json({ message: 'Erfolgreich beigetreten' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unbekannter Fehler' },
      { status: 500 }
    );
  }
}
