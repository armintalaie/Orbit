'use client';

import WorkspaceSwitcher from './workspaceSwitcher';
import WorkspaceProjects from './workspacesidebarProjects';
import WorkspaceSidebarTeams from '@/components/workspace/sidebar/workspaceSidebarTeams';
import Link from 'next/link';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { useContext } from 'react';

export default function Sidebar() {
  const { currentWorkspace } = useContext(OrbitContext);
  return (
    <>
      <div className='flex items-center gap-2 p-2'>
        <WorkspaceSwitcher />
      </div>

      <div className='flex flex-1 flex-col gap-2   rounded p-2'>
        <WorkspaceProjects />
        <WorkspaceSidebarTeams />
      </div>

      <div className='flex flex-1 flex-col gap-2' />
      <div className='flex  gap-2 p-2 '>
        <Link
          href={`/orbit/workspace/${currentWorkspace}/settings`}
          className='text-sm text-gray-500 hover:text-gray-700'
        >
          Settings
        </Link>
      </div>
    </>
  );
}
