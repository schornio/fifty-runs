import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { getCurrentSession } from "@/util/server/getCurrentSession";

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { notificationIds } = await req.json();
    if (!Array.isArray(notificationIds)) {
      return NextResponse.json({ error: "Ungültige Daten" }, { status: 400 });
    }

    //store read notifications
    await prisma.readNotification.createMany({
      data: notificationIds.map((notificationId) => ({
        userId: session.userId,
        notificationId,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({ message: "Benachrichtigungen als gelesen markiert" });
  } catch (error) {
    console.error("Fehler beim Speichern der gelesenen Benachrichtigungen:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
