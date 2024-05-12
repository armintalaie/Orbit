'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { useContext, useMemo, useState } from 'react';
import { Grid2X2, LockIcon, PaintBucket, User2 } from 'lucide-react';
import { UserSessionContext } from '@/lib/context/AuthProvider';
import ThemeToggle from '../themeToggle';
import { createClient } from '@/lib/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function AccountModal() {
  const [activeMenu, setActiveMenu] = useState('account');
  const menuOptions = useMemo(
    () => ({
      account: {
        label: 'Account',
        icon: <User2 size={16} />,
        content: <AccountSettings />,
      },
      workspaces: {
        label: 'Workspaces',
        icon: <Grid2X2 size={16} />,
        content: <WorkspacesSettings />,
      },
      security: {
        label: 'Security',
        icon: <LockIcon size={16} />,
        content: <SecuritySettings />,
      },
      appearance: {
        label: 'Appearance',
        icon: <PaintBucket size={16} />,
        content: <AppearanceSettings />,
      },
    }),
    []
  );

  return (
    <Dialog>
      <DialogTrigger>
        <button>Settings</button>
      </DialogTrigger>
      <DialogContent className='h-full max-h-[90%] w-full max-w-4xl overflow-hidden p-0'>
        <div className='flex'>
          <ModalSidebar
            menuOptions={menuOptions}
            setActiveMenu={setActiveMenu}
            activeMenu={activeMenu}
          />
          <div className='flex flex-1 p-4'>
            <div className='flex h-full w-full flex-col  items-center p-5'>
              <div className='flex w-full flex-col gap-4 divide-y '>
                <h1 className=' w-full text-2xl font-semibold'>
                  {menuOptions[activeMenu].label}
                </h1>
                <section className='flex w-full flex-col gap-4 py-5 '>
                  {menuOptions[activeMenu].content}
                </section>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ModalSidebar({ menuOptions, setActiveMenu, activeMenu }) {
  return (
    <div className='secondary-surface flex w-72 min-w-56 flex-col'>
      <div className='flex flex-1 flex-col gap-2 p-4'>
        <div className='flex items-center gap-2'>
          <h1 className='text-lg font-bold'>Settings</h1>
        </div>

        <div className='flex flex-1 flex-col gap-2 py-10'>
          {Object.entries(menuOptions).map(([key, option]) => (
            <Button
              variant='ghost'
              className='secondary-surface hover:tertiary-surface flex w-full justify-start gap-4 px-1'
              key={option.id}
              onClick={() => setActiveMenu(key)}
            >
              {option.icon}
              {option.label}
            </Button>
          ))}
        </div>

        <div className='flex  gap-2 '></div>
      </div>
    </div>
  );
}

export function AccountSettings() {
  const UserSession = useContext(UserSessionContext);
  const user = UserSession.user;
  const router = useRouter();

  async function signout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/signin');
  }

  return (
    <div className='flex w-full flex-col items-center  gap-5 '>
      <section className='flex w-full flex-col gap-4 py-5 '>
        <div className='flex items-center gap-4'>
          <h2 className='text-lg font-semibold'>Profile</h2>
          <Button
            onClick={signout}
            variant='outline'
            className='rounded-sm px-2 py-0 text-sm'
            type='button'
          >
            Sign out
          </Button>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <label htmlFor='name' className='text-sm font-semibold'>
              Email
            </label>
            <p>{user.email}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function AppearanceSettings() {
  return (
    <div className='flex h-full w-full flex-col  items-center gap-5'>
      <div className='secondary-surface flex h-full w-full flex-col  gap-5 rounded-md p-5'>
        At the moment, you can only change the theme of the application between
        light and dark.
        <ThemeToggle />
      </div>

      <div className='secondary-surface flex h-full w-full flex-col  items-center rounded-md p-5'>
        Your workspace admin can change the theme of the workspace to a custom
        theme.
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className='flex h-full w-full flex-col  items-center gap-5'>
      <div className='secondary-surface flex h-full w-full flex-col  items-center rounded-md p-5'>
        You can change your password here.
      </div>
      <div className='secondary-surface flex h-full w-full flex-col  items-center rounded-md p-5'>
        You can enable two-factor authentication here.
      </div>
    </div>
  );
}

function WorkspacesSettings() {
  return (
    <div className='flex h-full w-full flex-col  items-center gap-5'>
      <div className='secondary-surface flex h-full w-full flex-col  items-center rounded-md p-5'>
        You can create a new workspace here.
      </div>
      <div className='secondary-surface flex h-full w-full flex-col  items-center rounded-md p-5'>
        You can delete a workspace here.
      </div>
    </div>
  );
}
