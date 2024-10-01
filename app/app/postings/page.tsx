import { DonationReminder } from '@/components/view/DonationReminder';
import { MorePostings } from '@/components/view/MorePostings';
import { PostingForm } from '@/components/view/PostingForm';
import { Postings } from '@/components/view/Postings';
import { QuickPostingForm } from '@/components/view/QuickPostingForm';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { getPostings } from '@/model/posting/getPostings';

export default async function PostingsPage() {
  const session = await getCurrentSession();

  const postings = await getPostings({ session });
  const latestFrom = postings[postings.length - 1]?.date.toISOString();

  return (
    <div className="flex w-full max-w-2xl flex-col gap-5 p-5">
      <DonationReminder />
      <Postings
        contentAfter={
          <MorePostings from={latestFrom} userId={session?.userId} />
        }
        contentBefore={
          session ? (
            <>
              <div className="flex justify-center">
                <QuickPostingForm />
              </div>
              <PostingForm />
            </>
          ) : undefined
        }
        postings={postings}
        userId={session?.userId}
      />
    </div>
  );
}
