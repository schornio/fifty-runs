import { DonationMultiplierSetForm } from '@/components/view/DonationMultiplierSetForm';
import { PasswordChangeForm } from '@/components/view/PasswordChangeForm';
import { PostingForm } from '@/components/view/PostingForm';
import { Postings } from '@/components/view/Postings';
import { QuickPostingForm } from '@/components/view/QuickPostingForm';
import { UserImage } from '@/components/atomics/UserImage';
import { UserImageChangeForm } from '@/components/view/UserImageChangeForm';
import { donationMultiplierToNumber } from '@/model/donationMultiplierToNumber';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { getPostings } from '@/model/posting/getPostings';
import { notFound } from 'next/navigation';
import { prisma } from '@/prisma';
import GarminConnectButton from '@/components/composed/GarminButton/GarminConnectButton';
import GarminDisconnectButton from '@/components/composed/GarminButton/GarminDisconnectButton';

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

  const runStats = await prisma.runningStatistic.findUnique({
    where: { userId: user.id },
  });

  const totalDurationInMinutes = runStats
    ? Math.floor(runStats.durationInSeconds / 60)
    : 0;
  const totalDurationHours = Math.floor(totalDurationInMinutes / 60);
  const remainingMinutes = totalDurationInMinutes % 60;

  const totalDistanceInKilometers = runStats
    ? (runStats.distanceInMeters / 1000).toFixed(2)
    : '0.00';
  const averageMinutesPerKilometer =
    runStats && runStats.distanceInMeters > 0
      ? (totalDurationInMinutes / (runStats.distanceInMeters / 1000)).toFixed(2)
      : null;

  return (
    <div className="w-full max-w-xl p-5">
      <div className="flex flex-col gap-5">
        {user.image && (
          <div className="flex justify-center">
            <UserImage
              image={user.image}
              name={user.name}
              color="primary"
              size="standalone"
            />
          </div>
        )}
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

        <div className="flex flex-col gap-3 py-5 text-center">
          <div>
            <span className="text-xl font-bold text-congress-blue-900">
              {totalDurationHours > 0
                ? `${totalDurationHours}h ${remainingMinutes}min 🏃`
                : `${remainingMinutes}min 🏃`}
            </span>
            <div>Gesamte Laufdauer</div>
          </div>
          <div>
            <span className="text-xl font-bold text-congress-blue-900">
              {totalDistanceInKilometers} km 🚀
            </span>
            <div>Gesamte Kilometer</div>
          </div>
          <div>
            <span className="text-xl font-bold text-congress-blue-900">
              {averageMinutesPerKilometer
                ? `${averageMinutesPerKilometer} min/km`
                : 'Keine Daten'}{' '}
              ⌚️
            </span>
            <div>Durchschnittliche Minuten pro Kilometer</div>
          </div>
        </div>

        <div className="flex justify-center">
          <GarminConnectButton userId={user.id} />
        </div>
        <div className="flex justify-center">
          <GarminDisconnectButton userId={user.id} />
        </div>

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
            <div className="flex justify-center">
              <QuickPostingForm />
            </div>
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
