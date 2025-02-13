import { NextResponse } from "next/server";
import OAuth from "oauth-1.0a";
import crypto from "crypto";
import { prisma } from "@/prisma";

const GARMIN_MANUAL_ACTIVITY_URL = "https://apis.garmin.com/wellness-api/rest/manuallyUpdatedActivities";
const GARMIN_CONSUMER_KEY = process.env.GARMIN_CONSUMER_KEY!;
const GARMIN_CONSUMER_SECRET = process.env.GARMIN_CONSUMER_SECRET!;

export async function GET() {
  try {
    console.log("🚀 Cron-Job gestartet: Garmin-Datenimport für alle verbundenen Benutzer...");

    //check all users who are connected to Garmin
    const users = await prisma.user.findMany({
      where: { garminAccessToken: { not: null }, garminAccessTokenSecret: { not: null } },
      select: { id: true, garminAccessToken: true, garminAccessTokenSecret: true },
    });

    if (users.length === 0) {
      console.log("⚠️ Keine Garmin-verknüpften Benutzer gefunden.");
      return NextResponse.json({ message: "Keine Benutzer mit Garmin-Verbindung gefunden." });
    }

    //timestamp for the last 24 hours
    const endTime = Math.floor(Date.now() / 1000);
    const startTime = endTime - 86400;

    const results = [];

    //loop through all users
    for (const user of users) {
      console.log(`📡 Importiere Garmin-Daten für User ID: ${user.id}`);

      const oauth = new OAuth({
        consumer: { key: GARMIN_CONSUMER_KEY, secret: GARMIN_CONSUMER_SECRET },
        signature_method: "HMAC-SHA1",
        hash_function(base_string, key) {
          return crypto.createHmac("sha1", key).update(base_string).digest("base64");
        },
      });

      const token = { 
        key: user.garminAccessToken || "", 
        secret: user.garminAccessTokenSecret || "" 
      };

      const requestData = {
        url: `${GARMIN_MANUAL_ACTIVITY_URL}?uploadStartTimeInSeconds=${startTime}&uploadEndTimeInSeconds=${endTime}`,
        method: "GET",
      };

      const authHeader = oauth.toHeader(oauth.authorize(requestData, token));

      const response = await fetch(requestData.url, {
        method: "GET",
        headers: { Authorization: authHeader["Authorization"], Accept: "application/json" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Fehler für User ID ${user.id}:`, response.status, errorText);
        results.push({ userId: user.id, status: "Fehler", error: errorText });
        continue;
      }

      const data = await response.json();

      if (data.length === 0) {
        console.log(`⚠️ Keine neuen Aktivitäten für User ID ${user.id}.`);
        results.push({ userId: user.id, status: "Keine neuen Daten" });
        continue;
      }

      console.log(`✅ Import erfolgreich für User ID ${user.id}:`, data.length, "Aktivitäten.");

      //store acitivites (commented)**
      /*
      for (const activity of data) {
        await prisma.runningExercise.create({
          data: {
            id: activity.activityId.toString(),
            distanceInMeters: activity.distanceInMeters || 0,
            durationInSeconds: activity.durationInSeconds || 0,
            posting: {
              create: {
                date: new Date(activity.startTimeInSeconds * 1000),
                userId: user.id,
                visibility: "protected",
              },
            },
          },
        });

        await prisma.runningStatistic.upsert({
          where: { userId: user.id },
          update: {
            numberOfRuns: { increment: 1 },
            distanceInMeters: { increment: activity.distanceInMeters || 0 },
            durationInSeconds: { increment: activity.durationInSeconds || 0 },
          },
          create: {
            userId: user.id,
            season: "2025",
            numberOfRuns: 1,
            distanceInMeters: activity.distanceInMeters || 0,
            durationInSeconds: activity.durationInSeconds || 0,
          },
        });
      }
      */

      results.push({ userId: user.id, status: "Erfolgreich", activities: data.length });
    }

    return NextResponse.json({ message: "Garmin-Import abgeschlossen", results });

  } catch (error) {
    console.error("❌ Fehler beim Garmin-Import:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
