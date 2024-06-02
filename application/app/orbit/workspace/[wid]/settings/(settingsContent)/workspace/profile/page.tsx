import { SettingsContent, SettingsHeader } from '@/app/orbit/workspace/[wid]/settings/(settingsContent)/layout';
import React from 'react';
import WorkspaceAccountSettings from '@/components/workspace/settings/workspaceAccountSettings';

export default function Page() {
  return (
    <>
      <SettingsHeader>Profile</SettingsHeader>
      <SettingsContent>
        <div className='flex h-full w-full flex-col items-center  gap-10 overflow-y-scroll '>
          <WorkspaceAccountSettings />
        </div>
      </SettingsContent>
    </>
  );
}
