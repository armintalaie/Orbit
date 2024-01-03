import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import React from 'react';
import { Toaster } from '@/components/ui/sonner';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Orbit',
  description: 'Project management app built for Launch Pad',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='favicon.png' sizes='any' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta charSet='utf-8' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
      </head>
      <body className={inter.className}>
        <Theme
          appearance='light'
          accentColor='cyan'
          grayColor='sand'
          radius='large'
          scaling='95%'
        >
          {children}
          <Toaster />
        </Theme>
      </body>
    </html>
  );
}
