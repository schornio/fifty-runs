import { Box } from '@/components/atomics/Box';
import { RunningExercise } from '@/components/RunningExercise';
import { RunningExerciseCreateForm } from '@/components/view/RunningExerciseCreateForm';
import { Stack } from '@/components/atomics/Stack';
import { UserImage } from '@/components/atomics/UserImage';
import { UserImageChangeForm } from '@/components/UserImageChangeForm';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { prisma } from '@/prisma';

function selectVisibility(hasSession: boolean, isOwnProfile: boolean) {
  if (isOwnProfile) {
    return ['private', 'protected', 'public'];
  }

  if (hasSession) {
    return ['protected', 'public'];
  }

  return ['public'];
}

export default async function UserByIdPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const session = await getCurrentSession();
  const isOwnProfile = session?.userId === id;

  const [user, postings] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    }),
    prisma.runningExercise.findMany({
      where: {
        userId: id,
        visibility: {
          in: selectVisibility(Boolean(session), isOwnProfile),
        },
      },
    }),
  ]);

  return (
    <>
      <Box padding="double">
        <Stack
          alignBlock="center"
          alignInline="center"
          direction="column"
          gap="double"
        >
          {user.image ? (
            <UserImage
              image={user.image}
              name={user.name}
              color="primary"
              size="standalone"
            />
          ) : undefined}
          <h1>{user.name}</h1>{' '}
        </Stack>
      </Box>

      {isOwnProfile ? (
        <>
          <UserImageChangeForm />
        </>
      ) : undefined}
      <Box padding="normal">
        <Stack alignBlock="stretch" direction="column" gap="double">
          {isOwnProfile ? <RunningExerciseCreateForm /> : undefined}
          {postings.map(
            ({
              date,
              distanceInMeters,
              durationInSeconds,
              id: postingId,
              image,
              notes,
            }) => (
              <RunningExercise
                date={date.toISOString()}
                distanceInMeters={distanceInMeters}
                durationInSeconds={durationInSeconds}
                id={postingId}
                image={image}
                key={postingId}
                notes={notes}
                userId={user.id}
                userName={user.name}
                userImage={user.image}
              />
            )
          )}
        </Stack>
      </Box>
    </>
  );
}
