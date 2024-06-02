'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import { UserSessionContext } from '@/lib/context/AuthProvider';
import AccountWorkspaces from '@/components/account/accountWorkspaces';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useQuery, gql } from '@apollo/client';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';

const CHECK = gql`
  query GetWorkspaces {
    hello
  }
`;

export default function OrbitPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useContext(OrbitContext);
  const [foundHistory, setFoundHistory] = useState<'looking' | 'found' | 'not found'>('looking');

  useEffect(() => {
    // if (window.localStorage.getItem('currentWorkspace')) {
    //   const workspace = JSON.parse(window.localStorage.getItem('currentWorkspace') || '{}');
    //   if (workspace && workspace.id) {
    //     if (account.workspaces.find((w: any) => w.workspaceId === workspace.id)) {
    //       setFoundHistory('found');
    //       router.push(`${pathname}/workspace/${workspace.id}`);
    //     } else {
    //       setFoundHistory('not found');
    //     }
    //   } else {
    //     setFoundHistory('not found');
    //   }
    // } else {
    //   setFoundHistory('not found');
    // }
  }, []);

  // const introMessage = useMemo(() => {
  //   if (account.workspaces.length === 0) {
  //     return 'Create your first workspace to get started';
  //   }
  //   if (account.workspaces.length === 1) {
  //     return 'Loggin into your workspace...';
  //   }
  //   if (foundHistory === 'looking') {
  //     return 'Looking for your last workspace with this browser';
  //   }
  //   if (foundHistory === 'found') {
  //     return 'Logging into your last workspace';
  //   }
  //   if (foundHistory === 'not found') {
  //     return 'Choose a workspace to get started';
  //   }
  // }, [account, foundHistory]);

  return (
    <div className='primary-surface flex h-[100svh] w-[100svw] flex-row items-center justify-center '>
      <div className='secondary-surface flex h-[60%] w-full max-w-2xl flex-col gap-1 overflow-hidden rounded-2xl border-2 border-teal-800 p-0   shadow'>
        <div className=' flex flex-col items-center justify-center    bg-teal-800  p-4 text-white'>
          {/* <p>{introMessage}</p> */}
          {user.email}
        </div>
        <div className='flex flex-1 flex-col justify-center gap-4 p-6'>
          <AccountWorkspaces />
          {/* <AccountModal /> */}
        </div>
      </div>
    </div>
  );
}
