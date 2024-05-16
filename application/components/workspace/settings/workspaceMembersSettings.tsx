'use client';

import { Button } from '../../ui/button';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { WorkspaceMember } from '@/lib/types';
import Spinner from '@/components/general/Spinner';
import WorkspaceInvites from './workspaceInvite';
import { Contact2Icon } from 'lucide-react';
import WorkspaceMemberProfile from './workspaceMemberProfile';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function WorkspaceMembers() {
  const [showInvites, setShowInvites] = useState(false);
  const { members, isLoading, error } = useWorkspaceMembers();
  const [memberProfile , setMemberProfile] = useState<WorkspaceMember | undefined>();
  const membersComponent = useMemo(() => <MembersSection members={members} isLoading={isLoading} setMemberProfile={setMemberProfile}/>, [members]);

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading members</div>;

  if (memberProfile) {
    return <WorkspaceMemberProfile member={memberProfile} setMemberProfile={setMemberProfile} />;
  }
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

function MembersSection({ members, isLoading, setMemberProfile }: { members: WorkspaceMember[]; isLoading: boolean, setMemberProfile: (member: WorkspaceMember | undefined) => void}) {
  if (isLoading) return <div>Loading...</div>;

  const cleanData = useCallback((data: WorkspaceMember[]) => {
    return data.map((member) => {
      return {
        firstName: member.firstName,
        lastName: member.lastName,
        displayName: member.displayName,
        username: member.username,
      };
    });
  }, []);

  const membersinfo = cleanData(members);




  return (
    <div className='secondary-surface flex w-full flex-col items-center justify-start overflow-x-scroll rounded border text-xs'>
      <div className='primary-surface flex w-full flex-shrink-0 justify-between gap-2 border-b p-2 font-medium'>
      <span className='w-6 truncate  flex-shrink-0'></span>
        {Object.entries(membersinfo[0]).map(([key, value]) => (
          <span className='w-28 truncate  flex-shrink-0'>{key}</span>
        ))}
      </div>
      {membersinfo?.map((member) => (
        <div className=' primary-surface flex w-full justify-between gap-2 p-2 border-b  '>
            <Button className='w-6  p-1 h-fit truncate  flex-shrink-0' variant={"ghost"}
              onClick={() => setMemberProfile(members.find((m) => m.username === member.username))}
            >
              <Contact2Icon size={16} />
            </Button>

          {Object.entries(member).map(([key, value]) => (
            <span className='w-28 truncate flex-shrink-0'>{value}</span>
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
