import React from 'react';
import Sidebar from '@/components/account/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-[100svh] w-[100svw] flex-row '>
      <div className='secondary-surface flex w-72 min-w-56 flex-col border-r'>
        <div className='flex flex-1 flex-col gap-2 '>
          <Sidebar />
        </div>
      </div>
      <div className='primary-surface flex w-full flex-col overflow-hidden md:flex-col'>{children}</div>
    </div>
  );
}
