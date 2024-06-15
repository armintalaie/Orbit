'use client';

import { SettingsContent, SettingsHeader } from '@/app/orbit/workspace/[wid]/settings/(settingsContent)/layout';
import AccountWorkspacesPage from '@/components/account/accountWorkspacesPage';

export default function Page() {
  return (
    <>
      <SettingsHeader>Workspaces</SettingsHeader>
      <SettingsContent>
        <div className='flex h-full w-full flex-col items-center  gap-10 overflow-y-scroll '>
          <AccountWorkspacesPage />
        </div>
      </SettingsContent>
    </>
  );
}
