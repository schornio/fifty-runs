import { DismissDonationReminder } from './DismissDonationReminder';
import { DonationMultiplierSetForm } from '../DonationMultiplierSetForm';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { prisma } from '@/prisma';

async function shouldShowDonationReminder() {
  const session = await getCurrentSession();
  if (!session) {
    return false;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
      runDonationMultiplier: null,
    },
  });

  if (!user) {
    return false;
  }

  if ((user.runDonationMultiplierAskAgain?.getTime() ?? 0) > Date.now()) {
    return false;
  }

  return true;
}

export async function DonationReminder() {
  const showDonationReminder = await shouldShowDonationReminder();

  if (!showDonationReminder) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col gap-5 rounded-lg border border-gold-500 p-5">
        <div className="text-center text-lg">
          <h2 className="text-2xl font-bold text-gold-500">Erinnerung</h2>
          Du hast noch keinen Spendenmultiplikator gesetzt.
        </div>
        <DonationMultiplierSetForm />
        <DismissDonationReminder />
      </div>
    </>
  );
}
