import { SettingsContent, SettingsHeader } from '@/app/orbit/workspace/[wid]/settings/(settingsContent)/layout';
import React from 'react';

export default function WorkspaceSettingsPage() {
  return (
    <React.Fragment>
      <SettingsHeader>Orbit Settings</SettingsHeader>
      <SettingsContent>
        <div></div>
      </SettingsContent>
    </React.Fragment>
  );
}
