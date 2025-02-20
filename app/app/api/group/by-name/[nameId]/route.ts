import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';

export async function GET(
  request: Request,
  { params }: { params: { nameId: string } },
) {
  try {
    const group = await prisma.group.findUnique({
      where: { nameId: params.nameId },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!group) {
      return NextResponse.json(
        { error: 'Gruppe nicht gefunden' },
        { status: 404 },
      );
    }

    const teamStats = await prisma.runningStatistic.aggregate({
      _sum: {
        distanceInMeters: true,
        durationInSeconds: true,
      },
      where: {
        userId: { in: group.users.map((user) => user.id) },
      },
    });

    const totalDistance = (teamStats._sum.distanceInMeters || 0) / 1000; // km
    const totalDuration = teamStats._sum.durationInSeconds || 0; // sek
    const avgTimePerKm = totalDistance > 0 ? totalDuration / totalDistance : 0; // Sekunden pro km

    return NextResponse.json({
      id: group.id,
      name: group.name,
      users: group.users,
      totalDistance: totalDistance,
      totalDuration: totalDuration,
      avgTimePerKm: avgTimePerKm,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unbekannter Fehler' }, { status: 500 });
  }
}
