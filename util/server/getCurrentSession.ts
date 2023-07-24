import { prisma } from "@/prisma";
import { cookies } from "next/headers";

export async function getCurrentSession() {
  const cookie = cookies().get("sessionToken");
  const token = cookie?.value;

  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: {
      token,
    },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session;
}
