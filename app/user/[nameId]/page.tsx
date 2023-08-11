import { Box } from '@/components/atomics/Box';
import { PasswordChangeForm } from '@/components/view/PasswordChangeForm';
import { Posting } from '@/components/view/Posting';
import { PostingCreateForm } from '@/components/view/PostingCreateForm';
import { Stack } from '@/components/atomics/Stack';
import { UserImage } from '@/components/atomics/UserImage';
import { UserImageChangeForm } from '@/components/view/UserImageChangeForm';
import { Visibility } from '@prisma/client';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { notFound } from 'next/navigation';
import { prisma } from '@/prisma';

function selectVisibility(
  hasSession: boolean,
  isOwnProfile: boolean,
): Visibility[] {
  if (isOwnProfile) {
    return ['private', 'protected', 'public'];
  }

  if (hasSession) {
    return ['protected', 'public'];
  }

  return ['public'];
}

export default async function UserByIdPage({
  params: { nameId },
}: {
  params: { nameId: string };
}) {
  const session = await getCurrentSession();
  const user = await prisma.user.findUnique({
    where: {
      nameId,
    },
  });

  if (!user) {
    notFound();
  }

  const isOwnProfile = session?.userId === user?.id;

  const postings = await prisma.posting.findMany({
    orderBy: {
      date: 'desc',
    },
    select: {
      _count: {
        select: {
          comments: true,
        },
      },
      date: true,
      id: true,
      image: true,
      runningExercise: true,
      text: true,
    },
    where: {
      userId: user.id,
      visibility: {
        in: selectVisibility(Boolean(session), isOwnProfile),
      },
    },
  });

  return (
    <>
      <Box maxWidth="mobile" padding="normal">
        <Stack alignBlock="stretch" direction="column" gap="normal">
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

          {isOwnProfile ? (
            <>
              <PostingCreateForm />
              <UserImageChangeForm />
              <PasswordChangeForm />
            </>
          ) : undefined}

          <Stack alignBlock="stretch" direction="column" gap="double">
            {postings.map(
              ({ _count, date, id, image, runningExercise, text }) => (
                <Posting
                  commentCount={_count.comments}
                  date={date.toISOString()}
                  id={id}
                  image={image}
                  key={id}
                  runningExercise={runningExercise}
                  text={text}
                  userImage={user.image}
                  userName={user.name}
                  userNameId={user.nameId}
                />
              ),
            )}
          </Stack>
        </Stack>
      </Box>
    </>
  );
}
