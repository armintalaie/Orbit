'use client';
import React from 'react';
import { SettingsContent, SettingsHeader } from '@/app/orbit/workspace/[wid]/settings/(settingsContent)/layout';
import UserAccountSettings from '@/components/account/userAccountSettings';
import AccountWorkspacesPage from '@/components/account/accountWorkspacesPage';

export default function Page() {
  return (
    <>
      <SettingsHeader>Account</SettingsHeader>
      <SettingsContent>
        <div className='flex h-full w-full flex-col items-center  gap-10 overflow-y-scroll '>
          <UserAccountSettings />
        </div>
      </SettingsContent>
    </>
  );
}
