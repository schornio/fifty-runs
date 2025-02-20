import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import slugify from 'slugify';

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session || !session.user)
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });

    const { name } = await request.json();
    if (!name)
      return NextResponse.json({ error: 'Name erforderlich' }, { status: 400 });

    // Prüfe, ob bereits ein Team mit diesem Namen existiert
    const existingTeam = await prisma.group.findUnique({
      where: { name },
    });
    if (existingTeam) {
      return NextResponse.json(
        { error: 'Ein Team mit diesem Namen existiert bereits. Bitte wähle einen anderen Namen.' },
        { status: 400 }
      );
    }

    const baseSlug = slugify(name, { lower: true });
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (await prisma.group.findUnique({ where: { nameId: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    if (session.user.groupId) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { groupId: null },
      });
    }

    const group = await prisma.group.create({
      data: {
        name,
        nameId: uniqueSlug,
        createdById: session.user.id,
        adminId: session.user.id,
        users: { connect: { id: session.user.id } },
      },
    });

    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unbekannter Fehler' },
      { status: 500 }
    );
  }
}
