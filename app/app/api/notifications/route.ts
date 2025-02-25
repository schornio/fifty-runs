import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { getCurrentSession } from '@/util/server/getCurrentSession';

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h > 0 ? `${h} h ` : ''}${m > 0 ? `${m} min ` : ''}${s} sec`;
}

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ notifications: [] });
    }

    // Gelesene Benachrichtigungen des Users laden
    const readNotifications = await prisma.readNotification.findMany({
      where: { userId: session.userId },
      select: { notificationId: true },
    });
    const readNotificationIds = readNotifications.map((n) => n.notificationId);

    // Lauf-Synchronisierungen abrufen (nur eigene Läufe)
    const runningNotifications = await prisma.runningExercise.findMany({
      where: {
        posting: { userId: session.userId },
      },
      include: { posting: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Kommentare abrufen (nur zu eigenen Beiträgen)
    const commentNotifications = await prisma.comment.findMany({
      where: { posting: { userId: session.userId } },
      include: { user: true, posting: true },
      orderBy: { date: 'desc' },
      take: 50,
    });

    // Reaktionen abrufen (nur zu eigenen Beiträgen)
    const reactionNotifications = await prisma.reaction.findMany({
      where: { Posting: { userId: session.userId } },
      include: { user: true, Posting: true },
      orderBy: { date: 'desc' },
      take: 50,
    });

    // Alle Benachrichtigungen zusammenführen
    const allNotifications = [
      ...runningNotifications.map((exercise) => ({
        id: exercise.id,
        title: 'Neuer Lauf synchronisiert',
        description: `Gelaufen: ${(exercise.distanceInMeters / 1000).toFixed(2)} km in ${formatDuration(
          exercise.durationInSeconds
        )}`,
        // Wichtig: Datum aus RunningExercise.createdAt statt posting.date
        date: exercise.createdAt.toISOString(),
        read: readNotificationIds.includes(exercise.id),
      })),
      ...commentNotifications.map((comment) => ({
        id: comment.id,
        title: 'Neuer Kommentar',
        description: `${comment.user.name} hat deinen Beitrag kommentiert: "${comment.text}"`,
        date: comment.date.toISOString(),
        read: readNotificationIds.includes(comment.id),
      })),
      ...reactionNotifications.map((reaction) => ({
        id: reaction.id,
        title: 'Neue Reaktion',
        description: `${reaction.user.name} hat mit "${reaction.type}" auf deinen Beitrag reagiert.`,
        date: reaction.date.toISOString(),
        read: readNotificationIds.includes(reaction.id),
      })),
    ];

    // Alle Benachrichtigungen nach Datum (neueste zuerst) sortieren
    allNotifications.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json({ notifications: allNotifications });
  } catch (error) {
    console.error('Fehler beim Abrufen der Notifications:', error);
    return NextResponse.json({ notifications: [] });
  }
}
