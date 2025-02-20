import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { getCurrentSession } from '@/util/server/getCurrentSession';

export async function DELETE({ params }: { params: { id: string } }) {
    try {
        const session = await getCurrentSession();
        if (!session || !session.user) 
            return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });

        const group = await prisma.group.findUnique({
            where: { id: params.id },
        });

        if (!group) return NextResponse.json({ error: 'Gruppe nicht gefunden' }, { status: 404 });

        if (group.adminId !== session.user.id) 
            return NextResponse.json({ error: 'Nur Admins können die Gruppe löschen' }, { status: 403 });

        await prisma.group.delete({ where: { id: params.id } });

        return NextResponse.json({ message: 'Gruppe gelöscht' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unbekannter Fehler' }, { status: 500 });
    }
}
