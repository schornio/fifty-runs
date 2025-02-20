import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { getCurrentSession } from "@/util/server/getCurrentSession";

export async function GET(request: Request, context: { params?: { id?: string } }) {
  try {
    const { id } = context.params || {};
    if (!id) {
      return NextResponse.json({ error: "Gruppen-ID fehlt" }, { status: 400 });
    }

    const session = await getCurrentSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const existingRequest = await prisma.groupRequest.findFirst({
      where: {
        groupId: id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ hasRequested: Boolean(existingRequest) }, { status: 200 });
  } catch (error) {
    console.error("Fehler beim Prüfen der Beitrittsanfrage:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

export async function POST(request: Request, context: { params?: { id?: string } }) {
  try {
    const { id } = context.params || {};
    if (!id) {
      return NextResponse.json({ error: "Gruppen-ID fehlt" }, { status: 400 });
    }

    const session = await getCurrentSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const userId = session.user.id;

    const isMember = await prisma.user.findFirst({
      where: { id: userId, groupId: id },
    });

    if (isMember) {
      return NextResponse.json({ error: "Du bist bereits Mitglied dieser Gruppe." }, { status: 400 });
    }

    const existingRequest = await prisma.groupRequest.findFirst({
      where: { groupId: id, userId },
    });

    if (existingRequest) {
      return NextResponse.json({ error: "Beitrittsanfrage wurde bereits gesendet." }, { status: 400 });
    }

    await prisma.groupRequest.create({
      data: {
        groupId: id,
        userId,
      },
    });

    const group = await prisma.group.findUnique({
      where: { id },
      select: { adminId: true },
    });

    if (group?.adminId) {
      await prisma.readNotification.upsert({
        where: {
          userId_notificationId: {
            userId: group.adminId,
            notificationId: `${id}-${userId}-join-request`,
          },
        },
        update: {
          readAt: new Date(),
        },
        create: {
          userId: group.adminId,
          notificationId: `${id}-${userId}-join-request`,
          readAt: new Date(),
        },
      });
    }

    return NextResponse.json({ message: "Beitrittsanfrage gesendet" }, { status: 201 });
  } catch (error) {
    console.error("Fehler beim Erstellen der Beitrittsanfrage:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

//admin actions to approve or reject join requests
export async function PATCH(request: Request, context: { params?: { id?: string } }) {
  try {
    const { id } = context.params || {};
    if (!id) {
      return NextResponse.json({ error: "Gruppen-ID fehlt" }, { status: 400 });
    }

    const { userId, action } = await request.json();
    if (!userId || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
    }

    const session = await getCurrentSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const group = await prisma.group.findUnique({
      where: { id },
      select: { adminId: true },
    });

    if (!group || group.adminId !== session.user.id) {
      return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 });
    }

    const requestExists = await prisma.groupRequest.findFirst({
      where: { groupId: id, userId },
    });

    if (!requestExists) {
      return NextResponse.json({ error: "Beitrittsanfrage nicht gefunden" }, { status: 404 });
    }

    if (action === "approve") {
      const isAlreadyMember = await prisma.user.findFirst({
        where: { id: userId, groupId: id },
      });

      if (!isAlreadyMember) {
        await prisma.user.update({
          where: { id: userId },
          data: { groupId: id },
        });
      }
    }

    await prisma.groupRequest.deleteMany({
      where: { groupId: id, userId },
    });

    await prisma.readNotification.deleteMany({
      where: {
        userId: group.adminId,
        notificationId: `${id}-${userId}-join-request`,
      },
    });

    return NextResponse.json({ message: `Beitrittsanfrage ${action === "approve" ? "genehmigt" : "abgelehnt"}` }, { status: 200 });
  } catch (error) {
    console.error("Fehler beim Verwalten der Beitrittsanfrage:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
