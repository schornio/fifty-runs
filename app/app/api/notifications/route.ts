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

    const readNotifications = await prisma.readNotification.findMany({
      where: { userId: session.userId },
      select: { notificationId: true },
    });
    const readNotificationIds = readNotifications.map((n) => n.notificationId);

    const adminNotifications = await prisma.groupRequest.findMany({
      where: {
        group: { adminId: session.userId },
      },
      include: { user: true, group: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const runningNotifications = await prisma.runningExercise.findMany({
      where: {
        posting: { userId: session.userId },
      },
      include: { posting: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const commentNotifications = await prisma.comment.findMany({
      where: { posting: { userId: session.userId } },
      include: { user: true, posting: true },
      orderBy: { date: 'desc' },
      take: 50,
    });

    const reactionNotifications = await prisma.reaction.findMany({
      where: { Posting: { userId: session.userId } },
      include: { user: true, Posting: true },
      orderBy: { date: 'desc' },
      take: 50,
    });

    const allNotifications = [
      ...adminNotifications.map((request) => ({
        id: request.id,
        title: 'Neue Beitrittsanfrage',
        description: `${request.user.name} möchte der Gruppe "${request.group.name}" beitreten.`,
        date: request.createdAt.toISOString(),
        read: readNotificationIds.includes(request.id),
        userId: request.user.id,
        groupId: request.group.id,
      })),
      ...runningNotifications.map((exercise) => ({
        id: exercise.id,
        title: 'Neuer Lauf synchronisiert',
        description: `Gelaufen: ${(exercise.distanceInMeters / 1000).toFixed(2)} km in ${formatDuration(
          exercise.durationInSeconds
        )}`,
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

    allNotifications.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json({ notifications: allNotifications });
  } catch (error) {
    console.error('Fehler beim Abrufen der Notifications:', error);
    return NextResponse.json({ notifications: [] });
  }
}