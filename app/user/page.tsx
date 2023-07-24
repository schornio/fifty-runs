import { RunningExerciseCreateForm } from '@/components/RunningExerciseCreateForm';
import { RunningExerciseList } from '@/components/RunningExerciseList';
import { UserImageChangeForm } from '@/components/UserImageChangeForm';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { prisma } from '@/prisma';
import { redirect } from 'next/navigation';

export default async function UserPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect('/user/login');
  }

  const [user, runningExercises] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: {
        id: session.userId,
      },
    }),
    prisma.runningExercise.findMany({
      where: {
        userId: session.userId,
      },
    }),
  ]);

  return (
    <>
      <UserImageChangeForm />
    </>
  );
}
