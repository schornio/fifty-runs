import { EmailVerification } from '@/components/mail/EmailVerification';
import { hash } from 'bcrypt';
import { prisma } from '@/prisma';
import { put } from '@vercel/blob';
import { randomBytes } from 'crypto';
import { registerSchema } from '@/schema/register';
import { resend } from '@/util/mail';

const SALT_ROUNDS = 10;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const entities = Object.fromEntries(formData.entries());

    const {
      email,
      image,
      name,
      nameId,
      password: passwordPlain,
    } = registerSchema.parse(entities);

    const password = await hash(passwordPlain, SALT_ROUNDS);
    const emailVerificationToken = randomBytes(24).toString('hex');

    const user = await prisma.user.create({
      data: {
        email,
        emailVerificationToken,
        name,
        nameId,
        password,
      },
    });

    if (image && image.size > 0) {
      const { url } = await put(image.name, image, {
        access: 'public',
      });

      await prisma.user.update({
        data: {
          image: url,
        },
        where: {
          id: user.id,
        },
      });
    }

    await resend.sendEmail({
      from: 'noreply@app.50runs.com',
      react: EmailVerification({ emailVerificationToken, userName: name }),
      subject: '50runs: Email bestätigen',
      to: email,
    });

    return new Response();
  } catch {
    return new Response(undefined, { status: 400 });
  }
}
