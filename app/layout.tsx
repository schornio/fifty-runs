import './globals.css';
import { Footer } from '@/components/server/Footer';
import { Header } from '@/components/server/Header';
import { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { ReactNode } from 'react';
import { Stack } from '@/components/view/Stack';
import { getCurrentSession } from '@/util/server/getCurrentSession';
import { prisma } from '@/prisma';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  appleWebApp: true,
  description: '50runs',
  icons: {
    apple: '/image/Logo_50runs_neu_square.png',
    icon: '/image/Logo_50runs_neu_square.png',
    shortcut: '/image/Logo_50runs_neu_square.png',
  },
  manifest: '/manifest.json',
  title: '50runs',
  viewport: {
    initialScale: 1,
    interactiveWidget: 'overlays-content',
    width: 'device-width',
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getCurrentSession();
  const user = await (session
    ? prisma.user.findUnique({ where: { id: session.userId } })
    : undefined);

  return (
    <html lang="de">
      <body className={montserrat.className}>
        <Header />
        <Stack alignBlock="center" direction="vertical">
          {children}
        </Stack>
        <Footer />
      </body>
    </html>
  );
}
