import { prisma } from "@/prisma";
import { getCurrentSession } from "@/util/server/getCurrentSession";
import { del } from "@/util/server/vercelBlobShim";
import { badRequest } from "@/util/serverResponse/badRequest";
import { success } from "@/util/serverResponse/success";

export async function DELETE(
  _request: Request,
  { params: { id } }: { params: { id: string } }
) {
  const session = await getCurrentSession();
  if (!session) {
    return badRequest("Invalid session");
  }

  const runningExercise = await prisma.runningExercise.findUnique({
    where: {
      id,
      userId: session.userId,
    },
  });

  if (!runningExercise) {
    return badRequest("Invalid runningExercise");
  }

  if (runningExercise.image) {
    await del(runningExercise.image);
  }

  await prisma.runningExercise.delete({
    where: {
      id: runningExercise.id,
    },
  });

  return success({});
}
