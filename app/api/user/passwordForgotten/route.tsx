import { EmailPasswordForgotten } from '@/components/mail/EmailPasswordForgotten';
import { prisma } from '@/prisma';
import { randomBytes } from 'crypto';
import { resend } from '@/util/mail';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');

    if (!name || typeof name !== 'string') {
      throw new Error('No name provided');
    }

    const passwordResetToken = randomBytes(32).toString('hex');
    const passwordResetTokenExpiry = new Date();
    passwordResetTokenExpiry.setHours(passwordResetTokenExpiry.getHours() + 1);

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: name,
          },
          {
            name,
          },
        ],
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    await prisma.user.update({
      data: {
        passwordResetToken,
        passwordResetTokenExpiry,
      },
      where: {
        id: user.id,
      },
    });

    await resend.sendEmail({
      from: 'noreply@mailtest.schorn.io',
      react: EmailPasswordForgotten({ passwordResetToken }),
      subject: '50runs: Passwort vergessen',
      to: user.email,
    });

    return new Response();
  } catch {
    // Always return 200 to prevent user enumeration
    return new Response(undefined, { status: 200 });
  }
}
