import {
  ButtonShare,
  IsSharableWrapper,
} from '@/components/composed/ButtonShare';
import { Box } from '@/components/atomics/Box';
import { Comment } from '@/components/view/Comment';
import { CommentCreateForm } from '@/components/view/CommentCreateForm';
import { Metadata } from 'next';
import { Posting } from '@/components/view/Posting';
import { PostingDeleteButton } from '@/components/view/PostingDeleteButton';
import { Stack } from '@/components/atomics/Stack';
import { Text } from '@/components/atomics/Text';
import { UserLabel } from '@/components/composed/UserLabel';
import { reactions as availableReactions } from '@/model/reaction';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { getPostingById } from '@/service/getPostingById';
import { notFound } from 'next/navigation';

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
    (reaction) => reaction.userId === session?.userId,
  )?.type;

  const reactions = posting.reactions.map((reaction) => ({
    ...reaction,
    icon: availableReactions.find((r) => r.type === reaction.type)?.icon ?? '',
  }));

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
          commentCount={posting.comments.length}
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

        {reactions.length > 0 ? (
          <Stack gap="normal" wrap={true}>
            {reactions.map((reaction) => (
              <Box
                color="primary"
                padding="normal"
                roundedCorners={true}
                variant="outlined"
                key={reaction.id}
              >
                <Stack alignBlock="center" gap="normal">
                  <UserLabel
                    userName={reaction.user.name}
                    userNameId={reaction.user.nameId}
                    userImage={reaction.user.image}
                  />
                  <Text fontSize="heading2">{reaction.icon}</Text>
                </Stack>
              </Box>
            ))}
          </Stack>
        ) : undefined}

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
