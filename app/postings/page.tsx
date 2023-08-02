import { Box } from '@/components/atomics/Box';
import { Posting } from '@/components/view/Posting';
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
      reactions: true,
      runningExercise: true,
      text: true,
      user: {
        select: {
          image: true,
          name: true,
          nameId: true,
        },
      },
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
        {postings.map(
          ({
            _count,
            date,
            id,
            image,
            reactions,
            runningExercise,
            text,
            user,
          }) => (
            <Posting
              commentCount={_count.comments}
              date={date.toISOString()}
              runningExercise={runningExercise}
              id={id}
              image={image}
              key={id}
              reactions={reactions}
              text={text}
              userImage={user.image}
              userName={user.name}
              userNameId={user.nameId}
              userReactionType={
                reactions.find(
                  (reaction) => reaction.userId === session?.userId
                )?.type
              }
            />
          )
        )}
      </Stack>
    </Box>
  );
}
