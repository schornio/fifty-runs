import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

//all running activities that should be counted
const RUNNING_ACTIVITIES = [
  "RUNNING",
  "INDOOR_RUNNING",
  "OBSTACLE_RUN",
  "STREET_RUNNING",
  "TRACK_RUNNING",
  "TRAIL_RUNNING",
  "TREADMILL_RUNNING",
  "ULTRA_RUN",
  "VIRTUAL_RUN",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📡 Garmin Push erhalten:", body);

    if (!body.manuallyUpdatedActivities) {
      return NextResponse.json({ error: "Keine Aktivitäten erhalten" }, { status: 400 });
    }

    for (const activity of body.manuallyUpdatedActivities) {
      //check if activity is a running activity
      if (!RUNNING_ACTIVITIES.includes(activity.activityType)) {
        console.log(`🚫 Aktivität übersprungen: ${activity.activityType}`);
        continue;
      }

      console.log(`🏃‍♂️ Verarbeitung von ${activity.activityType}: ${activity.activityName}`);

      const garminAccessToken = activity.userAccessToken;
      const distanceInMeters = activity.distanceInMeters || 0;
      const durationInSeconds = activity.durationInSeconds || 0;
      const currentSeason = new Date().getFullYear().toString();

      //find user by garmin access token
      const user = await prisma.user.findFirst({
        where: { garminAccessToken: garminAccessToken },
        select: { id: true }, // Nur die `id` abrufen
      });

      if (!user) {
        console.log(`⚠️ FEHLER: Kein Nutzer mit Garmin Access Token ${garminAccessToken} gefunden.`);
        continue;
      }

      //update running statistic
      await prisma.runningStatistic.upsert({
        where: { userId: user.id },
        update: {
          numberOfRuns: { increment: 1 }, // Zähle die Läufe hoch
          distanceInMeters: { increment: distanceInMeters },
          durationInSeconds: { increment: durationInSeconds },
        },
        create: {
          userId: user.id,
          season: currentSeason,
          numberOfRuns: 1,
          distanceInMeters,
          durationInSeconds,
        },
      });

      console.log(`✅ RunningStatistic für User ${user.id} aktualisiert.`);
    }

    return NextResponse.json({ message: "Aktivitäten verarbeitet" });
  } catch (error) {
    console.error("❌ Fehler beim Verarbeiten des Webhooks:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
