import { Metadata } from 'next';
import { SidebarNav } from '../../components/settings/sidebar-nav';
import { Separator } from '@radix-ui/themes';
import React from 'react';

export const metadata: Metadata = {
  title: 'Forms',
  description: 'Advanced form example using react-hook-form and Zod.',
};

const sidebarNavItems = [
  // {
  //   title: "Profile",
  //   href: "/examples/forms",
  // },
  // {
  //   title: "Account",
  //   href: "/examples/forms/account",
  // },
  // {
  //   title: "Appearance",
  //   href: "/examples/forms/appearance",
  // },
  // {
  //   title: "Notifications",
  //   href: "/examples/forms/notifications",
  // },
  // {
  //   title: "Display",
  //   href: "/examples/forms/display",
  // },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <main className=' w-4xl: w-full '>
        <div className='  flex  h-full w-full flex-col p-2 pb-2'>
          <div className=' w-full pb-3 pt-2'>
            <h2 className='text-2xl font-bold tracking-tight'>Settings</h2>
            <p className='text-muted-foreground'>
              Manage your account settings and set e-mail preferences.
            </p>
          </div>
          <Separator className=' w-full ' orientation='horizontal' size={'4'} />

          <div className='flex h-full flex-col space-y-8 pt-4 lg:flex-row lg:space-x-12 lg:space-y-0'>
            <aside className=' h-full  border-gray-300 lg:w-1/5 '>
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className='flex-1 lg:max-w-2xl'>{children}</div>
          </div>
        </div>
      </main>
    </>
  );
}
