import { DonationMultiplierSetForm } from '@/components/view/DonationMultiplierSetForm';
import { PasswordChangeForm } from '@/components/view/PasswordChangeForm';
import { PostingForm } from '@/components/view/PostingForm';
import { Postings } from '@/components/view/Postings';
import { UserImage } from '@/components/atomics/UserImage';
import { UserImageChangeForm } from '@/components/view/UserImageChangeForm';
import { donationMultiplierToNumber } from '@/model/donationMultiplierToNumber';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { getPostings } from '@/model/posting/getPostings';
import { notFound } from 'next/navigation';
import { prisma } from '@/prisma';

const { format: formatCurrency } = new Intl.NumberFormat('de-de', {
  currency: 'EUR',
  style: 'currency',
});

export default async function UserByIdPage({
  params: { nameId },
}: {
  params: { nameId: string };
}) {
  const session = await getCurrentSession();
  const user = await prisma.user.findUnique({
    include: {
      group: true,
    },
    where: {
      nameId,
    },
  });

  if (!user) {
    notFound();
  }

  const isOwnProfile = session?.userId === user?.id;

  const postings = await getPostings({ byUserId: user.id, session, take: 100 });

  const donationSum = postings.reduce((sum, { donation, runningExercise }) => {
    if (donation) {
      return sum + donation.amountInCent;
    }

    if (runningExercise) {
      return (
        sum +
        donationMultiplierToNumber(user.runDonationMultiplier ?? 'nothing')
      );
    }

    return sum;
  }, 0);

  return (
    <div className="w-full max-w-xl p-5">
      <div className="flex flex-col gap-5">
        {user.image ? (
          <div className="flex justify-center">
            <UserImage
              image={user.image}
              name={user.name}
              color="primary"
              size="standalone"
            />
          </div>
        ) : undefined}
        <h1 className="text-center text-3xl font-bold text-congress-blue-900">
          {user.name}
        </h1>
        {user.group ? (
          <div className="text-center">
            <span className="text-xl font-bold text-congress-blue-900">
              {user.group.name}
            </span>
          </div>
        ) : undefined}
        {donationSum > 0 ? (
          <div className="flex flex-col py-10 text-center">
            <span className="text-4xl font-bold text-gold-500">
              {formatCurrency(donationSum / 100)}
            </span>
            Spenden gesamt
          </div>
        ) : undefined}
        {isOwnProfile ? (
          <>
            <PostingForm />
            <DonationMultiplierSetForm
              runDonationMultiplier={user.runDonationMultiplier}
            />
            <UserImageChangeForm />
            <PasswordChangeForm />
          </>
        ) : undefined}
        <Postings postings={postings} userId={user.id} />
      </div>
    </div>
  );
}
