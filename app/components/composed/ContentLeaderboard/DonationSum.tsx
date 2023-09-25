import { cache } from 'react';
import { donationMultiplierToNumber } from '@/model/donationMultiplierToNumber';
import { prisma } from '@/prisma';

const { format: formatCurrency } = new Intl.NumberFormat('de-de', {
  currency: 'EUR',
  style: 'currency',
});

const getDonationSum = cache(async () => {
  const donations = await prisma.donation.aggregate({
    _sum: {
      amountInCent: true,
    },
  });

  return donations._sum.amountInCent ?? 0;
});

const getAllUsers = cache(async () => {
  return await prisma.runningStatistic.findMany({
    orderBy: {
      numberOfRuns: 'desc',
    },
    select: {
      numberOfRuns: true,
      user: {
        select: {
          runDonationMultiplier: true,
        },
      },
    },
  });
});

export default async function DonationSum() {
  const [dontations, allUsers] = await Promise.all([
    getDonationSum(),
    getAllUsers(),
  ]);

  const donationsByRuns = allUsers.reduce((sum, { numberOfRuns, user }) => {
    return (
      sum +
      donationMultiplierToNumber(user.runDonationMultiplier ?? 'nothing') *
        numberOfRuns
    );
  }, 0);

  const allDonations = dontations + donationsByRuns;

  return (
    <div className="w-full max-w-screen-lg py-5">
      <div className="flex flex-col items-stretch gap-10">
        <h2 className="p-10 text-center">
          <span className="text-3xl font-bold text-gold-500">
            {formatCurrency(allDonations / 100)}
          </span>
          <br />
          Spenden gesamt
        </h2>
      </div>
    </div>
  );
}
