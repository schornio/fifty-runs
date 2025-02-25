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
    console.log("Push erhalten", body);

    //bring activities together (manual + automatic)
    const allActivities = [
      ...(body.manuallyUpdatedActivities || []), 
      ...(body.activities || []),
    ];

    if (allActivities.length === 0) {
      return NextResponse.json({ error: "Keine Aktivitäten erhalten" }, { status: 400 });
    }

    for (const activity of allActivities) {
      if (!RUNNING_ACTIVITIES.includes(activity.activityType)) {
        continue;
      }

      const {
        userAccessToken,
        activityId,
        distanceInMeters = 0,
        durationInSeconds = 0,
        activityName,
        activityDescription,
      } = activity;
      const currentSeason = process.env.SEASON || "2025";
      const activityDate = new Date(activity.startTimeInSeconds * 1000);

      //find user by garmin access token
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
        select: { 
          id: true, 
          distanceInMeters: true, 
          durationInSeconds: true, 
          postingId: true,
        },
      });

      if (existingActivity) {
        //if distance or duration has not changed, skip update
        if (
          existingActivity.distanceInMeters === distanceInMeters &&
          existingActivity.durationInSeconds === durationInSeconds
        ) {
          continue;
        }

        const diffDistance = distanceInMeters - existingActivity.distanceInMeters;
        const diffDuration = durationInSeconds - existingActivity.durationInSeconds;

        await prisma.posting.update({
          where: { id: existingActivity.postingId },
          data: {
            date: activityDate,
            text: activityDescription || activityName,
          },
        });

        await prisma.runningExercise.update({
          where: { garminActivityId: activityId.toString() },
          data: {
            distanceInMeters,
            durationInSeconds,
          },
        });

        await prisma.runningStatistic.update({
          where: { userId: user.id },
          data: {
            distanceInMeters: { increment: diffDistance },
            durationInSeconds: { increment: diffDuration },
          },
        })
        continue;
      }

      //create new posting if activity does not exist
      const newPosting = await prisma.posting.create({
        data: {
          date: activityDate,
          text: activityDescription || activityName,
          userId: user.id,
          visibility: "public",
          season: currentSeason,
        },
      });

      //store the new activity and link it to the posting
      await prisma.runningExercise.create({
        data: {
          garminActivityId: activityId.toString(),
          distanceInMeters,
          durationInSeconds,
          postingId: newPosting.id,
        },
      });

      //update running statistic
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

    return NextResponse.json({ message: "Aktivitäten erfolgreich verarbeitet & Posting erstellt/aktualisiert" });
  } catch (error) {
    console.error("Webhook-Verarbeitungsfehler:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
