'use client';
import ThemeToggle from '../../../../../../../../components/general/theme/themeToggle';
import React from 'react';
import { SettingsContent, SettingsHeader } from '@/app/orbit/workspace/[wid]/settings/(settingsContent)/layout';

export default function Page() {
  return (
    <React.Fragment>
      <SettingsHeader>Appearance</SettingsHeader>
      <SettingsContent>
        <div className='flex h-full w-full flex-col  items-center gap-5'>
          <div className='secondary-surface flex h-full w-full flex-col gap-5 rounded-md p-5 text-sm'>
            At the moment, the application has been only optimized for light mode. You can toggle between light and dark
            mode using the toggle below.
            <ThemeToggle />
          </div>
        </div>
      </SettingsContent>
    </React.Fragment>
  );
}
