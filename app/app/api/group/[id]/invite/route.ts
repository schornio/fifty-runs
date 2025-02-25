import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { getCurrentSession } from "@/util/server/getCurrentSession";
import { v4 as uuidv4 } from "uuid";

const TOKEN_VALIDITY_HOURS = 24;

export async function GET(request: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  try {
    const session = await getCurrentSession();
    if (!session || !session.user) {
      return NextResponse.json({ isMember: false }, { status: 200 });
    }

    const group = await prisma.group.findUnique({
      where: { id },
      include: { users: true },
    });

    if (!group) {
      return NextResponse.json({ isMember: false }, { status: 200 });
    }

    const isMember = group.users.some(user => user.id === session.user.id);
    return NextResponse.json({ isMember }, { status: 200 });
  } catch (error) {
    console.error("Fehler beim Überprüfen der Mitgliedschaft:", error);
    return NextResponse.json({ isMember: false }, { status: 500 });
  }
}

export async function POST(request: Request, context: { params: { id: string } }) {
  const { id } = context.params;

  try {
    const session = await getCurrentSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const group = await prisma.group.findUnique({
      where: { id },
      include: { users: true },
    });

    if (!group) {
      return NextResponse.json({ error: "Gruppe nicht gefunden" }, { status: 404 });
    }

    const isMember = group.users.some(user => user.id === session.user.id);
    if (!isMember) {
      return NextResponse.json({ error: "Nur Mitglieder können Einladungen erstellen" }, { status: 403 });
    }

    //check if invite link exists
    const existingInvite = await prisma.groupInvitation.findFirst({
      where: { groupId: id },
      orderBy: { createdAt: "desc" },
    });

    if (existingInvite) {
      const expirationDate = new Date(existingInvite.createdAt);
      expirationDate.setHours(expirationDate.getHours() + TOKEN_VALIDITY_HOURS);
      if (expirationDate > new Date()) {
        return NextResponse.json(existingInvite, { status: 200 });
      }
    }

    //create new invite token
    const invite = await prisma.groupInvitation.create({
      data: {
        groupId: id,
        token: uuidv4(),
      },
    });

    return NextResponse.json(invite, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unbekannter Fehler" },
      { status: 500 }
    );
  }
}
