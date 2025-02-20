import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { getCurrentSession } from '@/util/server/getCurrentSession';

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getCurrentSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const { newAdminId } = await request.json();

    const group = await prisma.group.findUnique({ where: { id: params.id } });

    if (!group) {
      return NextResponse.json(
        { error: 'Gruppe nicht gefunden' },
        { status: 404 },
      );
    }
    if (group.adminId !== session.user.id) {
      return NextResponse.json(
        { error: 'Keine Berechtigung' },
        { status: 403 },
      );
    }

    const updatedGroup = await prisma.group.update({
      where: { id: params.id },
      data: { adminId: newAdminId },
    });

    return NextResponse.json(
      { message: 'Admin übertragen', newAdminId: updatedGroup.adminId },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unbekannter Fehler' },
      { status: 500 },
    );
  }
}
