import React from 'react';
import AuthContextProvider from '@/lib/context/AuthProvider';
import Sidebar from '@/components/account/sidebar';
import OrbitContextProvider from '@/lib/context/OrbitGeneralContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthContextProvider>
      <OrbitContextProvider>
        <div className='flex h-[100svh] w-[100svw] flex-row '>
          <Sidebar />
          <div className='flex w-full  flex-col overflow-hidden md:flex-col'>{children}</div>
        </div>
      </OrbitContextProvider>
    </AuthContextProvider>
  );
}
