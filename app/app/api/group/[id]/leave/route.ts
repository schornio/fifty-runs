import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { getCurrentSession } from '@/util/server/getCurrentSession';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getCurrentSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const group = await prisma.group.findUnique({ where: { id: params.id } });
    if (!group) {
      return NextResponse.json({ error: 'Gruppe nicht gefunden' }, { status: 404 });
    }

    if (group.adminId === session.user.id) {
      return NextResponse.json(
        { error: 'Admin muss zuerst die Admin-Rechte übertragen, bevor er die Gruppe verlassen kann.' },
        { status: 400 }
      );
    }

    await prisma.group.update({
      where: { id: params.id },
      data: { users: { disconnect: { id: session.user.id } } },
    });

    return NextResponse.json({ message: 'Gruppe erfolgreich verlassen.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unbekannter Fehler' },
      { status: 500 }
    );
  }
}
