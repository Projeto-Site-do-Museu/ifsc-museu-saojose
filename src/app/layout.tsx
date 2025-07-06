import './globals.css';
import { AdminProvider } from '@/contexts/AdminContext';
import type { Metadata } from 'next';
import { Michroma, Work_Sans } from 'next/font/google';
import type { ReactNode } from 'react';

const michroma = Michroma({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-michroma',
});

const workSans = Work_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-work-sans',
});

export const metadata: Metadata = {
  title: 'Museu de São José',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${michroma.variable} ${workSans.variable}`}>
      <body className="bg-background text-white font-worksans">
        <AdminProvider>{children}</AdminProvider>
      </body>
    </html>
  );
}
