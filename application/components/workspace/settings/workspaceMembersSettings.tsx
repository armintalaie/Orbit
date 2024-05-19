'use client';

import { Button } from '../../ui/button';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { WorkspaceMember } from '@/lib/types';
import Spinner from '@/components/general/Spinner';
import WorkspaceInvites from './workspaceInvite';
import WorkspaceMemberProfile from './workspaceMemberProfile';
import Image from 'next/image';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function WorkspaceMembers() {
  const [showInvites, setShowInvites] = useState(false);
  const { members, isLoading, error } = useWorkspaceMembers();
  const [memberProfile, setMemberProfile] = useState<WorkspaceMember | undefined>();
  const membersComponent = useMemo(
    () => <MembersSection members={members} isLoading={isLoading} setMemberProfile={setMemberProfile} />,
    [members]
  );

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

function MembersSection({
  members,
  isLoading,
  setMemberProfile,
}: {
  members: WorkspaceMember[];
  isLoading: boolean;
  setMemberProfile: (member: WorkspaceMember | undefined) => void;
}) {
  if (isLoading) return <div>Loading...</div>;

  const cleanData = useCallback((data: WorkspaceMember[]) => {
    return data.map((member) => {
      return {
        avatar: member.avatar,

        firstName: member.firstName,
        lastName: member.lastName,
        status: member.status,
        username: member.username,
        location: member.location,
        timezone: member.timezone,
        pronouns: member.pronouns,
      };
    });
  }, []);

  const membersinfo = cleanData(members);

  return (
    <div className='secondary-surface flex w-full flex-col items-center justify-start overflow-x-scroll rounded border text-xs'>
      <div className='primary-surface flex w-full flex-shrink-0 justify-between gap-2 border-b p-2 text-left font-medium'>
        {Object.entries(membersinfo[0]).map(([key, value]) =>
          key === 'avatar' ? (
            <span className='w-8 flex-shrink-0 truncate'></span>
          ) : (
            <span className='min-w-24 flex-1 flex-shrink-0 truncate text-left'>{key}</span>
          )
        )}
      </div>
      {membersinfo?.map((member) => (
        <Button
          variant={'ghost'}
          className=' primary-surface flex w-full justify-between gap-2 border-b p-2 text-2xs  '
          onClick={() => setMemberProfile(members.find((m) => m.username === member.username))}
        >
          {Object.entries(member).map(([key, value]) =>
            key === 'avatar' ? (
              <span className='w-8 flex-shrink-0 truncate'>
                <Image src={value} alt='avatar' width={24} height={24} className='rounded-full' />
              </span>
            ) : (
              <span className='min-w-24 flex-1 flex-shrink-0 truncate text-left'>{value}</span>
            )
          )}
        </Button>
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
