import ModalSidebar from '@/components/account/accountModalSidebar';
import React from 'react';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-full  w-full overflow-hidden p-0'>
      <ModalSidebar />
      {children}
    </div>
  );
}
