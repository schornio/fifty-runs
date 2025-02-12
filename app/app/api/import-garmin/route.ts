import { NextRequest, NextResponse } from "next/server";
import OAuth from "oauth-1.0a";
import crypto from "crypto";
import { prisma } from "@/prisma";

const startTime = Math.floor(new Date("2024-02-11T00:00:00Z").getTime() / 1000);
const endTime = Math.floor(new Date("2024-02-12T00:00:00Z").getTime() / 1000);

const GARMIN_MANUAL_ACTIVITY_URL = `https://apis.garmin.com/wellness-api/rest/activities?uploadStartTimeInSeconds=${startTime}&uploadEndTimeInSeconds=${endTime}`;
const GARMIN_CONSUMER_KEY = process.env.GARMIN_CONSUMER_KEY!;
const GARMIN_CONSUMER_SECRET = process.env.GARMIN_CONSUMER_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Benutzer-ID fehlt" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { garminAccessToken: true, garminAccessTokenSecret: true },
    });

    if (!user?.garminAccessToken || !user?.garminAccessTokenSecret) {
      return NextResponse.json({ error: "Kein Garmin-Token vorhanden" }, { status: 403 });
    }

    // ✅ OAuth 1.0a korrekt signieren
    const oauth = new OAuth({
      consumer: { key: GARMIN_CONSUMER_KEY, secret: GARMIN_CONSUMER_SECRET },
      signature_method: "HMAC-SHA1",
      hash_function(base_string, key) {
        return crypto.createHmac("sha1", key).update(base_string).digest("base64");
      },
    });

    const token = {
      key: user.garminAccessToken,
      secret: user.garminAccessTokenSecret,
    };

    const requestData = {
      url: GARMIN_MANUAL_ACTIVITY_URL,
      method: "GET",
    };

    const authHeader = oauth.toHeader(oauth.authorize(requestData, token));

    // ✅ Anfrage an Garmin API stellen
    const response = await fetch(GARMIN_MANUAL_ACTIVITY_URL, {
      method: "GET",
      headers: {
        Authorization: authHeader["Authorization"],
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Garmin API Fehler:", response.status, errorText);
      return NextResponse.json({ error: `Garmin API Fehler: ${response.status}, ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Garmin-Daten:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
