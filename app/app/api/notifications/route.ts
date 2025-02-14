import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { getCurrentSession } from "@/util/server/getCurrentSession";

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return `${h > 0 ? `${h} h ` : ""}${m > 0 ? `${m} min ` : ""}${s} sec`;
}

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ notifications: [] });
    }

    const notifications = await prisma.runningExercise.findMany({
      include: {
        posting: true,
      },
      orderBy: {
        posting: {
          date: "desc",
        },
      },
      take: 10,
    });

    const readNotifications = await prisma.readNotification.findMany({
      where: { userId: session.userId },
      select: { notificationId: true },
    });

    const readNotificationIds = readNotifications.map((n) => n.notificationId);

    

    return NextResponse.json({
      notifications: notifications.map((exercise) => ({
        id: exercise.id,
        title: "Neuer Lauf synchronisiert",
        description: `Gelaufen: ${(exercise.distanceInMeters / 1000).toFixed(2)} km in ${formatDuration(exercise.durationInSeconds)}`,
        date: exercise.posting.date.toISOString(),
        read: readNotificationIds.includes(exercise.id),
      })),
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der Notifications:", error);
    return NextResponse.json({ notifications: [] });
  }
}
