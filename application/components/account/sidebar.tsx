'use client';
import AccountModal from '@/components/account/accountModal';
import { UserSessionContext } from '@/lib/context/AuthProvider';
import { useContext, useEffect, useState } from 'react';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import useSWR from 'swr';
import Link from 'next/link';
import LinearSkeleton from '../general/linearSkeleton';

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
    <div className='secondary-surface flex w-72 min-w-56 flex-col'>
      <div className='flex flex-1 flex-col gap-2 p-4'>
        <div className='flex items-center gap-2'>
          <Select
            value={currentWorkspace?.id}
            onValueChange={(e) => {
              changeWorkspace(e);
            }}
          >
            <SelectTrigger className='primary-surface w-full text-sm'>
              <SelectValue className='text-xs' placeholder='Select a workspace' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {userInfo &&
                  userInfo.workspaces.map((workspace) => (
                    <SelectItem
                      value={workspace.workspaceId}
                      key={workspace.workspaceId}
                      className='flex items-center gap-2  py-2'
                      onClick={() => changeWorkspace(workspace.workspaceId)}
                    >
                      <span>
                        {workspace.name}
                        {workspace.id}
                      </span>
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className='flex flex-1 flex-col gap-2   rounded p-2'>
          <WorkspaceProjects />
        </div>

        <div className='flex flex-1 flex-col gap-2' />
        <div className='flex  gap-2 '>
          <AccountModal />
        </div>
      </div>
    </div>
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
