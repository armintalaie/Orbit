import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import '@radix-ui/themes/styles.css';
import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/lib/context/ThemeProvider';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});
export const metadata: Metadata = {
  title: 'Orbit',
  description: 'Project management app for teams',
  icons: [
    {
      rel: 'icon',
      url: 'icons/icon-128x128.png',
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning={true} className=''>
      <head>
        <meta charSet='utf-8' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
        <title>Orbit</title>
      </head>
      <body suppressHydrationWarning={true} className={poppins.className}>
        <ThemeProvider attribute='class' defaultTheme='dark'>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
