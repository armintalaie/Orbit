'use client';
import AccountModal from '@/components/account/accountModal';
import { UserSessionContext } from '@/lib/context/AuthProvider';
import { useContext, useEffect, useState } from 'react';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import useSWR from 'swr';
import Link from 'next/link';
import LinearSkeleton from '../general/linearSkeleton';
import { Button } from '../ui/button';
import { PanelLeftIcon } from 'lucide-react';

export default function Sidebar() {
  const UserSession = useContext(UserSessionContext);
  const [userInfo, setUserInfo] = useState(null);
  const { changeWorkspace, currentWorkspace } = useContext(OrbitContext);

  async function getUserInfo() {
    const res = await fetch(`/api/v2/users/${UserSession.user.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${UserSession.access_token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setUserInfo(data);
    }
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <>
      <div className='flex items-center gap-2 p-2'>
        <Select
          value={currentWorkspace?.id}
          onValueChange={(e) => {
            changeWorkspace(e);
          }}
        >
          <SelectTrigger className='primary-surface h-fit w-full rounded-xl p-1 px-2 text-sm'>
            <SelectValue className='text-xs' placeholder='Select a workspace' />
          </SelectTrigger>
          <SelectContent className='flex w-full flex-col gap-4 border-none bg-transparent shadow-none'>
            <div className='flex flex-col gap-2 text-sm'>
              {userInfo &&
                userInfo.workspaces.map((workspace) => (
                  <SelectItem
                    className='primary-surface flex items-center gap-2 rounded-xl border p-1 px-4 shadow-lg '
                    value={workspace.workspaceId}
                    key={workspace.workspaceId}
                    onClick={() => changeWorkspace(workspace.workspaceId)}
                  >
                    <span>
                      {workspace.name}
                      {workspace.id}
                    </span>
                  </SelectItem>
                ))}
            </div>
          </SelectContent>
        </Select>
        <Button size={'icon'} onClick={() => {}} variant='ghost' className='rounded-sm px-2 py-0 text-sm' type='button'>
          <PanelLeftIcon size={14} />
        </Button>
      </div>

      <div className='flex flex-1 flex-col gap-2   rounded p-2'>
        <WorkspaceProjects />
      </div>

      <div className='flex flex-1 flex-col gap-2' />
      <div className='flex  gap-2 '>
        <AccountModal />
      </div>
    </>
  );
}

export function useWorkspaceProjects() {
  const { currentWorkspace } = useContext(OrbitContext);
  const { data, isLoading, error } = useSWR(`/api/v2/workspaces/${currentWorkspace?.id}/projects`, (url) =>
    fetch(url).then((res) => res.json())
  );

  return {
    projects: data,
    isLoading,
    error,
  };
}

function WorkspaceProjects() {
  const { currentWorkspace } = useContext(OrbitContext);
  const { projects, isLoading, error } = useWorkspaceProjects();

  if (error) {
    return <div>could not fetch projects</div>;
  }

  return (
    <div className='flex flex-1 flex-col gap-2 text-sm'>
      <Link href={`/orbit/workspace/${currentWorkspace.id}/projects`} className='text-xs'>
        Projects
      </Link>
      <div className='flex flex-col '>
        {isLoading ? (
          <LinearSkeleton />
        ) : (
          <>
            {projects.map((project) => (
              <Link
                className='rounded-md border  border-transparent p-1 hover:border-teal-700 hover:shadow-sm'
                href={`/orbit/workspace/${currentWorkspace.id}/projects/${project.id}`}
                shallow
                key={project.id}
              >
                {project.name}
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
