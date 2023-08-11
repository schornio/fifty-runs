import { Box } from '@/components/atomics/Box';
import { MorePostings } from '@/components/view/MorePostings';
import { Posting } from '@/components/view/Posting';
import { PostingCreateForm } from '@/components/view/PostingCreateForm';
import { Stack } from '@/components/atomics/Stack';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { getPostings } from '@/model/posting/getPostings';

export default async function PostingsPage() {
  const session = await getCurrentSession();

  const postings = await getPostings({ session });
  const latestFrom = postings[postings.length - 1]?.date.toISOString();

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
                  (reaction) => reaction.userId === session?.userId,
                )?.type
              }
            />
          ),
        )}
        <MorePostings from={latestFrom} userId={session?.userId} />
      </Stack>
    </Box>
  );
}
