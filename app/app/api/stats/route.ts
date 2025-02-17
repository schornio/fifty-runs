import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  // Falls keine userId übergeben wird, brechen wir ab
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  // Laufstatistik für den entsprechenden User laden
  const runStats = await prisma.runningStatistic.findUnique({
    where: { userId: userId },
  });

  // Falls keine Statistik vorhanden ist, liefern wir Default-Werte
  if (!runStats) {
    return NextResponse.json({
      totalDurationHours: 0,
      remainingMinutes: 0,
      totalDistanceInKilometers: '0.00',
      averageMinutesPerKilometer: null,
    });
  }

  // Berechnungen
  const totalDurationInMinutes = Math.floor(runStats.durationInSeconds / 60);
  const totalDurationHours = Math.floor(totalDurationInMinutes / 60);
  const remainingMinutes = totalDurationInMinutes % 60;
  const totalDistanceInKilometers = (runStats.distanceInMeters / 1000).toFixed(2);
  const averageMinutesPerKilometer =
    runStats.distanceInMeters > 0
      ? (totalDurationInMinutes / (runStats.distanceInMeters / 1000)).toFixed(2)
      : null;

  // JSON-Antwort mit den Statistiken
  return NextResponse.json({
    totalDurationHours,
    remainingMinutes,
    totalDistanceInKilometers,
    averageMinutesPerKilometer,
  });
}
