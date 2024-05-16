import React from 'react';
import AuthContextProvider from '@/lib/context/AuthProvider';
import Sidebar from '@/components/account/sidebar';
import OrbitContextProvider from '@/lib/context/OrbitGeneralContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthContextProvider>
      <OrbitContextProvider>
        <div className='flex h-[100svh] w-[100svw] flex-row dark:bg-neutral-900 dark:text-neutral-200 '>
          <Sidebar />
          <div className='flex w-full  flex-col overflow-hidden md:flex-col'>
            {/* {children} */}
            <div className='flex h-full w-full flex-1 flex-col items-center justify-center p-2'>
              Nothing to see here yet. You are signed in but there is no content to display.
            </div>
          </div>
        </div>
      </OrbitContextProvider>
    </AuthContextProvider>
  );
}
