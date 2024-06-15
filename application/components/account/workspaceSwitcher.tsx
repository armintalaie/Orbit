'use client';
import { UserSessionContext } from '@/lib/context/AuthProvider';
import { useContext } from 'react';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import useSWR from 'swr';

export default function WorkspaceSwitcher() {
  const { changeWorkspace, currentWorkspace } = useContext(OrbitContext);
  const { userInfo, error, isLoading } = useUserInfo();

  if (isLoading) {
    return <SwithcerFallback />;
  }

  if (error) {
    return <SwithcerFallback />;
  }

  return (
    <Select
      value={currentWorkspace?.id}
      onValueChange={(e) => {
        changeWorkspace(e);
      }}
    >
      <SelectTrigger className='primary-surface  h-8 w-full rounded-xl p-1 px-2 text-sm'>
        <SelectValue className='text-xs' placeholder='Select a workspace' />
      </SelectTrigger>
      <SelectContent className='flex w-full flex-col gap-4 border-none bg-transparent shadow-none'>
        <div className='flex flex-col gap-2 text-sm'>
          {userInfo &&
            userInfo.workspaces.map((workspace) => (
              <SelectItem
                className='primary-surface flex items-center gap-2 rounded-xl border p-1 px-4 shadow-sm '
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
  );
}

function useUserInfo() {
  const { user } = useContext(UserSessionContext);
  const { swrFetcher } = useContext(OrbitContext);
  const { data, error, isLoading } = useSWR(`/api/v2/users/${user.id}`, swrFetcher);

  return {
    userInfo: data,
    isLoading,
    error,
  };
}

function SwithcerFallback() {
  return <div className='primary-surface h-8 w-full rounded-xl border p-1 px-2 text-sm'></div>;
}
