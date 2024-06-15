import React from 'react';
import AuthContextProvider from '@/lib/context/AuthProvider';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='primary-surface flex h-[100svh] w-[100svw] flex-row '>
      <AuthContextProvider>
        <div className='flex h-[100svh] w-[100svw] flex-row '>{children}</div>
      </AuthContextProvider>
    </div>
  );
}
