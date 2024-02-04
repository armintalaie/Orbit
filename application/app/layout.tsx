import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@radix-ui/themes/styles.css';
import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = {
  title: 'Orbit',
  description: 'Project management app for teams',
  icons: [{ rel: 'icon', url: 'icons/icon-128x128.png' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning={true}>
      <head>
        <meta charSet='utf-8' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
        />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <ThemeProvider enableSystem={true} attribute='class'>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
