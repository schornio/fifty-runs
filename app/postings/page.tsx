import { Box } from '@/components/atomics/Box';
import { RunningExercise } from '@/components/RunningExercise';
import { RunningExerciseCreateForm } from '@/components/view/RunningExerciseCreateForm';
import { Stack } from '@/components/atomics/Stack';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { prisma } from '@/prisma';

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
      // reactions: {
      //   select: {
      //     type: true,
      //     user: {
      //       select: {
      //         image: true,
      //         name: true,
      //       },
      //     },
      //   },
      // },
      user: {
        select: {
          id: true,
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
    <Box padding="normal">
      <Stack alignBlock="stretch" direction="column" gap="double">
        {session ? <RunningExerciseCreateForm /> : undefined}
        {postings.map(
          ({
            date,
            distanceInMeters,
            durationInSeconds,
            id,
            image,
            notes,
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
              userName={user.name}
              userImage={user.image}
            />
          )
        )}
      </Stack>
    </Box>
  );
}
