import { Posting } from '@/components/view/Posting';
import { PostingResponse } from '@/model/posting/getPostings';
import { ReactNode } from 'react';

export function Postings({
  contentAfter,
  contentBefore,
  postings = [],
  userId,
}: {
  contentAfter?: ReactNode;
  contentBefore?: ReactNode;
  postings?: PostingResponse;
  userId: string | undefined;
}) {
  return (
    <div className="flex flex-col gap-5">
      {contentBefore}
      {postings.map(
        ({
          _count,
          date,
          donation,
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
            donation={donation}
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
              reactions.find((reaction) => reaction.userId === userId)?.type
            }
          />
        ),
      )}
      {contentAfter}
    </div>
  );
}
