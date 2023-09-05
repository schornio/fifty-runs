import { MorePostings } from '@/components/view/MorePostings';
import { PostingCreateForm } from '@/components/view/PostingCreateForm';
import { Postings } from '@/components/view/Postings';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { getPostings } from '@/model/posting/getPostings';

export default async function PostingsPage() {
  const session = await getCurrentSession();

  const postings = await getPostings({ session });
  const latestFrom = postings[postings.length - 1]?.date.toISOString();

  return (
    <div className="w-full max-w-2xl p-5">
      <Postings
        contentAfter={
          <MorePostings from={latestFrom} userId={session?.userId} />
        }
        contentBefore={<PostingCreateForm />}
        postings={postings}
        userId={session?.userId}
      />
    </div>
  );
}
