import {
  ButtonShare,
  IsSharableWrapper,
} from '@/components/composed/ButtonShare';
import { Box } from '@/components/atomics/Box';
import { Comment } from '@/components/view/Comment';
import { CommentCreateForm } from '@/components/view/CommentCreateForm';
import { Metadata } from 'next';
import { Posting } from '@/components/Posting';
import { PostingDeleteButton } from '@/components/view/PostingDeleteButton';
import { Stack } from '@/components/atomics/Stack';
import { Visibility } from '@prisma/client';
import { cache } from 'react';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { notFound } from 'next/navigation';
import { prisma } from '@/prisma';

export const getPostingById = cache(async (id: string, userId?: string) => {
  const visibility: Visibility[] = userId
    ? ['public']
    : ['public', 'protected'];

  const ownPostingsQuery = userId ? [{ userId }] : [];

  return await prisma.posting.findUnique({
    include: {
      comments: {
        include: {
          user: {
            select: {
              image: true,
              name: true,
              nameId: true,
            },
          },
        },
      },
      reactions: {
        include: {
          user: {
            select: {
              image: true,
              name: true,
              nameId: true,
            },
          },
        },
      },
      runningExercise: true,
      user: {
        select: {
          image: true,
          name: true,
          nameId: true,
        },
      },
    },
    where: {
      OR: [{ visibility: { in: visibility } }, ...ownPostingsQuery],
      id,
    },
  });
});

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}): Promise<Metadata> {
  const session = await getCurrentSession();
  const posting = await getPostingById(id, session?.userId);

  if (!posting) {
    return {};
  }

  return {
    openGraph: {
      description: posting.text ?? undefined,
      title: `${posting.user.name} - 50 runner`,
    },
  };
}

export default async function PostingByIdPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const session = await getCurrentSession();
  const posting = await getPostingById(id, session?.userId);

  if (!posting) {
    notFound();
  }

  const ownPosting = posting.userId === session?.userId;
  const userReactionType = posting.reactions.find(
    (reaction) => reaction.userId === session?.userId
  )?.type;

  return (
    <Box maxWidth="mobile" padding="normal">
      <Stack alignBlock="stretch" direction="column" gap="normal">
        {posting.visibility === 'public' ? (
          <IsSharableWrapper>
            <Box padding="double">
              <ButtonShare>Teilen</ButtonShare>
            </Box>
          </IsSharableWrapper>
        ) : undefined}
        <Posting
          date={posting.date.toISOString()}
          id={posting.id}
          userName={posting.user.name}
          userNameId={posting.user.nameId}
          userImage={posting.user.image}
          text={posting.text}
          image={posting.image}
          runningExercise={posting.runningExercise}
          reactions={posting.reactions}
          userReactionType={userReactionType}
        />
        {posting.comments.map((comment) => (
          <Comment
            date={comment.date.toISOString()}
            id={comment.id}
            key={comment.id}
            ownComment={comment.userId === session?.userId}
            text={comment.text}
            userImage={comment.user.image}
            userName={comment.user.name}
            userNameId={comment.user.nameId}
          />
        ))}
        <CommentCreateForm postingId={posting.id} />
        {ownPosting ? <PostingDeleteButton id={posting.id} /> : undefined}
      </Stack>
    </Box>
  );
}
