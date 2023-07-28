import { Box } from '@/components/atomics/Box';
import { Posting } from '@/components/Posting';
import { PostingCreateForm } from '@/components/view/PostingCreateForm';
import { Stack } from '@/components/atomics/Stack';
import { Visibility } from '@prisma/client';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { prisma } from '@/prisma';

export default async function PostingsPage() {
  const session = await getCurrentSession();

  const visibility: Visibility[] = session
    ? ['public', 'protected']
    : ['public'];

  const ownPostingsQuery = session
    ? [
        {
          userId: session.userId,
        },
      ]
    : [];

  const postings = await prisma.posting.findMany({
    include: {
      runningExercise: true,
      user: {
        select: {
          image: true,
          name: true,
          nameId: true,
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
    <Box maxWidth="mobile" padding="normal">
      <Stack alignBlock="stretch" direction="column" gap="double">
        {session ? <PostingCreateForm /> : undefined}
        {postings.map(({ date, id, image, runningExercise, text, user }) => (
          <Posting
            date={date.toISOString()}
            runningExercise={runningExercise}
            id={id}
            image={image}
            key={id}
            text={text}
            userImage={user.image}
            userName={user.name}
            userNameId={user.nameId}
          />
        ))}
      </Stack>
    </Box>
  );
}
