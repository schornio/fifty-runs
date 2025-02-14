import { NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function GET() {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const deleted = await prisma.readNotification.deleteMany({
      where: { readAt: { lt: oneMonthAgo } },
    });

    console.log(`Cron-Job: ${deleted.count} alte Benachrichtigungen gelöscht`);

    return NextResponse.json({ message: `${deleted.count} alte Notifications gelöscht` });
  } catch (error) {
    console.error("Fehler beim Löschen alter Notifications:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
