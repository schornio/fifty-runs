import { Box } from '@/components/view/Box';
import { RunningExercise } from '@/components/RunningExercise';
import { RunningExerciseCreateForm } from '@/components/RunningExerciseCreateForm';
import { Stack } from '@/components/view/Stack';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { prisma } from '@/prisma';
import { ReactionType } from '@/model/reaction';

export default async function PostingsPage() {
  const session = await getCurrentSession();

  const visibility = session ? ['public', 'protected'] : ['public'];

  const ownPostingsQuery = session
    ? [
        {
          userId: session.userId,
        },
      ]
    : [];

  const postings = await prisma.runningExercise.findMany({
    include: {
      reactions: {
        select: {
          type: true,
          user: {
            select: {
              image: true,
              name: true,
            },
          },
        },
      },
      user: {
        select: {
          image: true,
          name: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
    where: {
      OR: [
        {
          visibility: {
            in: visibility,
          },
        },
        ...ownPostingsQuery,
      ],
    },
  });

  return (
    <Box padding="1">
      <Stack alignBlock="stretch" gap="2">
        {session ? <RunningExerciseCreateForm /> : undefined}
        {postings.map(
          ({
            date,
            distanceInMeters,
            durationInSeconds,
            id,
            image,
            notes,
            reactions,
            user,
          }) => (
            <RunningExercise
              date={date.toISOString()}
              distanceInMeters={distanceInMeters}
              durationInSeconds={durationInSeconds}
              id={id}
              image={image}
              key={id}
              notes={notes}
              reactions={
                reactions as {
                  type: ReactionType;
                  user: { image?: string | null; name: string };
                }[]
              }
              userName={user.name}
              userImage={user.image}
            />
          )
        )}
      </Stack>
    </Box>
  );
}
