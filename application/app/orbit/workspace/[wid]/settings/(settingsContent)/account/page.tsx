'use client';
import React from 'react';
import { SettingsContent, SettingsHeader } from '@/app/orbit/workspace/[wid]/settings/(settingsContent)/layout';
import UserAccountSettings from '@/components/account/userAccountSettings';
import AccountWorkspaces from '@/components/account/accountWorkspaces';

export default function Page() {
  return (
    <>
      <SettingsHeader>Account and Workspaces</SettingsHeader>
      <SettingsContent>
        <div className='flex h-full w-full flex-col items-center  gap-10 overflow-y-scroll '>
          <AccountWorkspaces />
          <UserAccountSettings />
        </div>
      </SettingsContent>
    </>
  );
}
