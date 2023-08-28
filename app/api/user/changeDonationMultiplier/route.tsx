import { donationMultiplierSchema } from '@/schema/donationMultiplier';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { prisma } from '@/prisma';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const entities = Object.fromEntries(formData.entries());

    const { donationMultiplier } = donationMultiplierSchema.parse(entities);

    const session = await getCurrentSession();
    if (!session) {
      throw new Error('Not logged in');
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }

    await prisma.user.update({
      data: {
        runDonationMultiplier:
          donationMultiplier === 'nothing' ? null : donationMultiplier,
      },
      where: {
        id: user.id,
      },
    });

    return new Response(undefined, { status: 200 });
  } catch {
    return new Response(undefined, { status: 400 });
  }
}
