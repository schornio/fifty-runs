import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Benutzer-ID fehlt" }, { status: 400 });
    }

    //delete garmin auth data
    await prisma.user.update({
      where: { id: userId },
      data: {
        garminAccessToken: null,
        garminAccessTokenSecret: null,
      },
    });

    return NextResponse.json({ message: "Garmin-Verbindung erfolgreich getrennt" });
  } catch (error) {
    console.error("❌ Fehler beim Trennen der Garmin-Verbindung:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
