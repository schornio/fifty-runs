import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { Footer } from '@/components/view/Footer';
import { Header } from '@/components/view/Header';
import { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { ReactNode } from 'react';
import { cn } from '@/util/cn';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  appleWebApp: true,
  description: '50runs',
  icons: {
    apple: '/image/Logo_50runs_square_winter.png',
    icon: '/image/Logo_50runs_square_winter.png',
    shortcut: '/image/Logo_50runs_square_winter.png',
  },
  manifest: '/manifest.json',
  title: '50runs',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body
        className={cn(
          montserrat.className,
          'grid min-h-screen grid-rows-[auto_1fr_auto]',
        )}
      >
        <Header />
        <div className="flex flex-col items-center">{children}</div>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
