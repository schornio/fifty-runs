import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { getCurrentSession } from '@/util/server/getCurrentSession';

export async function POST(request: Request) {
    try {
        const session = await getCurrentSession();
        if (!session || !session.user) 
            return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });

        const { token } = await request.json();
        if (!token) return NextResponse.json({ error: 'Einladungstoken erforderlich' }, { status: 400 });

        const invitation = await prisma.groupInvitation.findUnique({
            where: { token },
        });

        if (!invitation) return NextResponse.json({ error: 'Ungültiger Einladungscode' }, { status: 404 });

        await prisma.group.update({
            where: { id: invitation.groupId },
            data: { users: { connect: { id: session.user.id } } },
        });

        await prisma.groupInvitation.delete({ where: { token } });

        return NextResponse.json({ message: 'Erfolgreich beigetreten' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unbekannter Fehler' }, { status: 500 });
    }
}
