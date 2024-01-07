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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning={true}>
      <head>
        <link rel='icon' href='favicon.png' sizes='any' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'
        />
        <meta charSet='utf-8' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        {/* <Theme
          appearance='light'
          accentColor='blue'
          grayColor='sand'
          radius='large'
          scaling='95%'
        > */}
        <ThemeProvider enableSystem={true} attribute='class'>
          {children}
          <Toaster />
        </ThemeProvider>
        {/* </Theme> */}
      </body>
    </html>
  );
}
