import {
  ButtonShare,
  IsSharableWrapper,
} from '@/components/composed/ButtonShare';
import { Comment } from '@/components/view/Comment';
import { CommentCreateForm } from '@/components/view/CommentCreateForm';
import { Metadata } from 'next';
import { Posting } from '@/components/view/Posting';
import { PostingDeleteButton } from '@/components/view/PostingDeleteButton';
import { PostingForm } from '@/components/view/PostingForm';
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
    <div className="w-full max-w-2xl p-5">
      <div className="flex flex-col gap-5">
        {posting.visibility === 'public' ? (
          <IsSharableWrapper>
            <div className="p-10">
              <ButtonShare>Teilen</ButtonShare>
            </div>
          </IsSharableWrapper>
        ) : undefined}
        <Posting
          commentCount={posting.comments.length}
          date={posting.date.toISOString()}
          donation={posting.donation}
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
          <div className="flex flex-wrap gap-5">
            {reactions.map((reaction) => (
              <div
                className="flex items-center gap-2 rounded-2xl border border-congress-blue-900 px-3 py-2"
                key={reaction.id}
              >
                <UserLabel
                  userName={reaction.user.name}
                  userNameId={reaction.user.nameId}
                  userImage={reaction.user.image}
                />
                <span className="text-2xl">{reaction.icon}</span>
              </div>
            ))}
          </div>
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
        <CommentCreateForm posting={posting} />
        {ownPosting ? (
          <PostingForm
            donationAmountCent={posting.donation?.amountInCent}
            editPostingId={posting.id}
            exerciseDurationSeconds={posting.runningExercise?.durationInSeconds}
            exerciseDistanceMeters={posting.runningExercise?.distanceInMeters}
            postingType={
              posting.runningExercise
                ? 'runningExercise'
                : posting.donation
                ? 'donation'
                : undefined
            }
            text={posting.text ?? undefined}
          />
        ) : undefined}
        {ownPosting ? <PostingDeleteButton id={posting.id} /> : undefined}
      </div>
    </div>
  );
}
