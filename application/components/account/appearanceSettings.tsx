'use client';
import ThemeToggle from '../general/themeToggle';

export default function AppearanceSettings() {
  return (
    <div className='flex h-full w-full flex-col  items-center gap-5'>
      <div className='secondary-surface flex h-full w-full flex-col  gap-5 rounded-md p-5'>
        At the moment, you can only change the theme of the application between light and dark.
        <ThemeToggle />
      </div>

      <div className='secondary-surface flex h-full w-full flex-col  items-center rounded-md p-5'>
        Your workspace admin can change the theme of the workspace to a custom theme.
      </div>
    </div>
  );
}
