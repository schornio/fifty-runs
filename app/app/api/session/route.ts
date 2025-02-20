import { compare } from 'bcrypt';
import { cookies } from 'next/headers';
import { createSession } from '@/util/server/createSession';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { loginSchema } from '@/schema/login';
import { prisma } from '@/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const entities = Object.fromEntries(formData.entries());
    const { name, password } = loginSchema.parse(entities);
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            name,
          },
          {
            email: name,
          },
        ],
      },
    });

    if (!user) {
      throw new Error('Invalid user');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Passwords do not match');
    }

    if (!user.emailVerified) {
      throw new Error('Email not verified');
    }

    await createSession(user.id);

    return new Response();
  } catch {
    return new Response(undefined, { status: 400 });
  }
}

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || !session.user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user: { id: session.user.id, name: session.user.name } }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Abrufen der Session' }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await getCurrentSession();

  if (session) {
    prisma.session.delete({ where: { id: session.id } });
  }

  cookies().delete('sessionToken');
  return new Response();
}
