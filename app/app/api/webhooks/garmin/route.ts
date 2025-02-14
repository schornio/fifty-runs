import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

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
    //console.log("Garmin push body:", body);

    if (!body.manuallyUpdatedActivities) {
      return NextResponse.json({ error: "Keine Aktivitäten erhalten" }, { status: 400 });
    }

    for (const activity of body.manuallyUpdatedActivities) {
      if (!RUNNING_ACTIVITIES.includes(activity.activityType)) {
        continue;
      }

      const { userAccessToken, activityId, distanceInMeters = 0, durationInSeconds = 0, activityName, activityDescription } = activity;
      const currentSeason = process.env.SEASON || "2025";
      const activityDate = new Date(activity.startTimeInSeconds * 1000);

      //find user by garminAccessToken
      const user = await prisma.user.findFirst({
        where: { garminAccessToken: userAccessToken },
        select: { id: true },
      });

      if (!user) {
        console.error("Fehlende Zuordnung: Kein Nutzer mit Garmin Access Token gefunden.");
        continue;
      }

      //check if activity already exists
      const existingActivity = await prisma.runningExercise.findUnique({
        where: { garminActivityId: activityId.toString() },
        select: { id: true, distanceInMeters: true, durationInSeconds: true },
      });

      if (existingActivity) {
        //case 1: activity already exists and has the same distance and duration, only type changed
        if (
          existingActivity.distanceInMeters === distanceInMeters &&
          existingActivity.durationInSeconds === durationInSeconds
        ) {
          continue;
        }

        //distance or duration changed
        await prisma.runningStatistic.update({
          where: { userId: user.id },
          data: {
            numberOfRuns: { decrement: 1 },
            distanceInMeters: { decrement: existingActivity.distanceInMeters },
            durationInSeconds: { decrement: existingActivity.durationInSeconds },
          },
        });

        //delete old activity
        await prisma.runningExercise.delete({
          where: { garminActivityId: activityId.toString() },
        });
      }

      //new posting
      const newPosting = await prisma.posting.create({
        data: {
          date: activityDate,
          text: activityDescription || activityName,
          userId: user.id,
          visibility: "public",
          season: currentSeason,
        },
      });

      //store new acitiviy in db and link it to posting
      await prisma.runningExercise.create({
        data: {
          garminActivityId: activityId.toString(),
          distanceInMeters,
          durationInSeconds,
          postingId: newPosting.id,
        },
      });

      //update running statistics
      await prisma.runningStatistic.upsert({
        where: { userId: user.id },
        update: {
          numberOfRuns: { increment: 1 },
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
    }

    return NextResponse.json({ message: "Aktivitäten erfolgreich verarbeitet & Posting erstellt" });
  } catch (error) {
    console.error("Webhook-Verarbeitungsfehler:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
