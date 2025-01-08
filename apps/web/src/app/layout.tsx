import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import '@repo/ui/styles.css';
import Providers from '../components/Providers';
import { auth } from '../lib/auth';

export const metadata: Metadata = {
  title: 'Schedule System',
  description: '',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
