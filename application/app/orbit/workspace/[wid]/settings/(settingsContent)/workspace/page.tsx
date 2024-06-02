import { SettingsContent, SettingsHeader } from '@/app/orbit/workspace/[wid]/settings/(settingsContent)/layout';
import React from 'react';
import WorkspaceGeneralSettings from '@/components/workspace/settings/workspaceGeneralSettings';

export default function Page() {
  return (
    <>
      <SettingsHeader>General</SettingsHeader>
      <SettingsContent>
        <div className='flex h-full w-full flex-col items-center  gap-10 overflow-y-scroll '>
          <WorkspaceGeneralSettings />
        </div>
      </SettingsContent>
    </>
  );
}
