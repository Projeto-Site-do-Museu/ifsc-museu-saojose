import './globals.css';
import FontLoader from '@/components/FontLoader';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Museu de São José',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-background text-white font-worksans">
        <FontLoader />
        {children}
      </body>
    </html>
  );
}
