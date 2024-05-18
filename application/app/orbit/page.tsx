'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import { UserSessionContext } from '@/lib/context/AuthProvider';
import AccountWorkspaces from '@/components/account/accountWorkspaces';
import AccountModal from '@/components/account/accountModal';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function OrbitPage() {
  const { account } = useContext(UserSessionContext);
  const router = useRouter();
  const pathname = usePathname();
  const [foundHistory, setFoundHistory] = useState<'looking' | 'found' | 'not found'>('looking');

  if (!account) {
    return router.push('/auth/signin');
  }

  useEffect(() => {
    if (window.localStorage.getItem('currentWorkspace')) {
      const workspace = JSON.parse(window.localStorage.getItem('currentWorkspace') || '{}');
      if (workspace && workspace.id) {
        if (account.workspaces.find((w: any) => w.workspaceId === workspace.id)) {
          setFoundHistory('found');
          router.push(`${pathname}/workspace/${workspace.id}`);
        } else {
          setFoundHistory('not found');
        }
      } else {
        setFoundHistory('not found');
      }
    } else {
      setFoundHistory('not found');
    }
  }, []);

  const introMessage = useMemo(() => {
    if (account.workspaces.length === 0) {
      return 'Create your first workspace to get started...';
    }
    if (account.workspaces.length === 1) {
      return 'Loggin into your workspace...';
    }
    if (foundHistory === 'looking') {
      return 'Looking for your last workspace with this browser...';
    }
    if (foundHistory === 'found') {
      return 'Logging into your last workspace...';
    }
    if (foundHistory === 'not found') {
      return 'Choose a workspace to get started...';
    }
  }, [account, foundHistory]);

  return (
    <div className='primary-surface flex h-[100svh] w-[100svw] flex-row items-center justify-center '>
      <div className='secondary-surface flex h-[60%] w-full max-w-xl flex-col gap-4 rounded-lg border  p-5 py-2  shadow'>
        <div className='mb-4 flex flex-col items-center justify-center gap-4 rounded-lg border bg-gradient-to-r  from-teal-800 to-teal-700 p-2 text-white'>
          <p>{introMessage}</p>
        </div>
        <h1 className='text-2xl font-bold'>Hi {account.firstName},</h1>

        <AccountWorkspaces />
        <AccountModal />
      </div>
    </div>
  );
}
