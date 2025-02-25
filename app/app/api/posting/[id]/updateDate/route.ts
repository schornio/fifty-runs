import { prisma } from '@/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { date } = await req.json();

    if (!id || !date) {
      return NextResponse.json({ message: 'Fehlende Parameter' }, { status: 400 });
    }

    const updatedPosting = await prisma.posting.update({
      where: { id: String(id) },
      data: { date: new Date(date) },
    });

    return NextResponse.json(updatedPosting, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Interner Serverfehler' }, { status: 500 });
  }
}
