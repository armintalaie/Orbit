'use client';
import React from 'react';
import AuthContextProvider from '@/lib/context/AuthProvider';
import OrbitContextProvider from '@/lib/context/OrbitGeneralContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='primary-surface flex h-[100svh] w-[100svw] flex-row '>
      <AuthContextProvider>
        <OrbitContextProvider>
          <div className='flex h-[100svh] w-[100svw] flex-row '>{children}</div>
        </OrbitContextProvider>
      </AuthContextProvider>
    </div>
  );
}
