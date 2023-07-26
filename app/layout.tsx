import './globals.css';
import { Footer } from '@/components/view/Footer';
import { Header } from '@/components/view/Header';
import { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { ReactNode } from 'react';
import { Stack } from '@/components/atomics/Stack';
// import { getCurrentSession } from '@/util/server/getCurrentSession';
// import { prisma } from '@/prisma';

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
    maximumScale: 1,
    width: 'device-width',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // const session = await getCurrentSession();
  // const user = await (session
  //   ? prisma.user.findUnique({ where: { id: session.userId } })
  //   : undefined);

  return (
    <html lang="de">
      <body className={montserrat.className}>
        <Header />
        <Stack alignBlock="center" direction="column">
          {children}
        </Stack>
        <Footer />
      </body>
    </html>
  );
}
