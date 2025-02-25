import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { getCurrentSession } from '@/util/server/getCurrentSession';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
      const session = await getCurrentSession();
      if (!session || !session.user) {
        return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
      }
  
      const group = await prisma.group.findUnique({
        where: { id: params.id },
        include: { users: { select: { id: true, name: true } } },
      });
  
      if (!group) {
        return NextResponse.json({ error: 'Gruppe nicht gefunden' }, { status: 404 });
      }
  
      return NextResponse.json({ 
        members: group.users, 
        adminId: group.adminId
      }, { status: 200 });
  
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Unbekannter Fehler' },
        { status: 500 }
      );
    }
  }
  
