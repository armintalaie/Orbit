'use client';

import { Button } from '../../ui/button';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { WorkspaceMember } from '@/lib/types';
import Spinner from '@/components/general/Spinner';
import WorkspaceInvites from './workspaceInvite';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function WorkspaceMembers() {
  const [showInvites, setShowInvites] = useState(false);
  const { members, isLoading, error } = useWorkspaceMembers();
  const membersComponent = useMemo(() => <MembersSection members={members} isLoading={isLoading} />, [members]);

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading members</div>;

  return (
    <div className='flex h-full w-full flex-col items-center gap-5 overflow-hidden'>
      <div className=' flex w-full flex-col gap-5'>
        <div className=' flex w-full justify-between gap-5'>
          <div></div>
          <Button onClick={() => setShowInvites((prev) => !prev)}>
            {showInvites ? 'Close Invites' : 'Invite Member'}
          </Button>
        </div>

        {showInvites ? <WorkspaceInvites /> : membersComponent}
      </div>
    </div>
  );
}

function MembersSection({ members, isLoading }: { members: WorkspaceMember[]; isLoading: boolean }) {
  if (isLoading) return <div>Loading...</div>;

  const cleanData = useCallback((data: WorkspaceMember[]) => {
    return data.map((member) => {
      return {
        firstName: member.firstName,
        lastName: member.lastName,
        displayName: member.displayName,
        pronouns: member.pronouns,
        location: member.location,
        username: member.username,
      };
    });
  }, []);

  const membersinfo = cleanData(members);

  return (
    <div className='secondary-surface flex w-full flex-col items-center justify-start overflow-x-scroll rounded border text-xs'>
      <div className='primary-surface flex w-full flex-shrink-0 justify-between gap-4 border-b p-2 font-medium'>
        {Object.entries(membersinfo[0]).map(([key, value]) => (
          <span className='w-32  flex-shrink-0'>{key}</span>
        ))}
      </div>
      {membersinfo?.map((member) => (
        <div className=' primary-surface flex w-full justify-between gap-4 p-2  '>
          {Object.entries(member).map(([key, value]) => (
            <span className='w-32 flex-shrink-0'>{value}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

function useWorkspaceMembers() {
  const { currentWorkspace } = useContext(OrbitContext);
  const { data, error, isLoading } = useSWR(`/api/v2/workspaces/${currentWorkspace.id}/members`, fetcher);

  return {
    members: data as WorkspaceMember[],
    isLoading,
    error,
  };
}
