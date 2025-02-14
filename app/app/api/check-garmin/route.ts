import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Benutzer-ID fehlt" }, { status: 400 });
  }

  // Da 'id' in der Datenbank in der Regel der Primärschlüssel ist,
  // ist dieser Query schon sehr performant. Zur weiteren Entlastung
  // fügen wir Cache-Control-Header hinzu, damit identische Anfragen
  // für 60 Sekunden (s-maxage) zwischengespeichert werden.
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { garminAccessToken: true },
  });

  return NextResponse.json(
    { isConnected: !!user?.garminAccessToken },
    {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=30",
      },
    }
  );
}
