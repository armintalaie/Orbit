'use client'; // top to the file
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { GearIcon } from '@radix-ui/react-icons';
import SettingsLayout from './SettingsLayout';
import { OrbitContext } from '@/lib/context/OrbitContext';
import { useContext } from 'react';

export function SettingsModalButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='flex h-8 w-full items-center rounded-sm border border-gray-200 bg-white p-1 px-2 text-left text-xs text-gray-500 shadow-sm dark:border-neutral-800 dark:bg-neutral-800'>
          <GearIcon className='mr-2 h-3 w-3' />
          <span>Settings</span>
        </button>
      </DialogTrigger>
      <DialogContent className='max-h-full max-w-full sm:h-5/6 sm:max-w-3xl'>
        <SettingsLayout>
          <SettingsProfilePage />
        </SettingsLayout>
        <DialogFooter className='sm:justify-start'>
          <DialogClose asChild></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SettingsProfilePage() {
  const { fetcher } = useContext(OrbitContext);

  async function signout() {
    const res = await fetcher('/api/auth/signout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    if (res.redirected) {
      window.location.href = res.url;
    }
  }
  return (
    <div className='space-y-6'>
      <div></div>
      <Button
        variant='outline'
        onClick={() => signout()}
        className='w-32 rounded-md px-4 py-2 text-left text-sm font-medium text-gray-900 transition hover:bg-gray-100 focus:bg-gray-100 focus:outline-none'
      >
        Sign out
      </Button>
    </div>
  );
}
