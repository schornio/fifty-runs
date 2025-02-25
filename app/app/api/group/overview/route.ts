import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';

export async function GET() {
    try {
        const groups = await prisma.group.findMany({
            include: { _count: { select: { users: true } } },
        });

        return NextResponse.json(groups, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unbekannter Fehler' }, { status: 500 });
    }
}
