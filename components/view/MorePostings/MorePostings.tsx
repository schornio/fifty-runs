'use client';

import { memo, useCallback, useState } from 'react';
import { More } from '@/components/atomics/More';
import { Posting } from '../Posting';
import { PostingResponseParsed } from '@/model/posting/getPostings';
import { usePromise } from '@/util/usePromise';

async function fetchMorePostings({ from }: { from?: string }) {
  const query = new URLSearchParams();

  if (from) {
    query.set('from', from);
  }

  const response = await fetch(`/api/posting?${query}`);
  const body = (await response.json()) as PostingResponseParsed;
  return body;
}

function MorePostingsComponent({
  from,
  userId,
}: {
  from?: string;
  userId?: string;
}) {
  const [postings, setPostings] = useState<PostingResponseParsed>([]);

  const { invoke, status } = usePromise(fetchMorePostings);

  const latestFrom = postings[postings.length - 1]?.date ?? from;

  const onMore = useCallback(async () => {
    const morePostings = await invoke({
      from: latestFrom,
    });
    if (morePostings.status === 'resolved') {
      setPostings((prevPostings) => [...prevPostings, ...morePostings.result]);
    }
  }, [invoke, latestFrom]);

  return (
    <>
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
            date={date}
            runningExercise={runningExercise}
            id={id}
            image={image}
            key={id}
            reactions={reactions.map((reaction) => ({
              ...reaction,
              date: new Date(reaction.date),
            }))}
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
      <More onMore={onMore} />
      {status === 'pending' ? <div>...</div> : undefined}
      {status === 'rejected' ? (
        <div>Fehler beim laden älterer Postings</div>
      ) : undefined}
    </>
  );
}

export const MorePostings = memo(MorePostingsComponent);
