'use client';

import { Button } from '../../ui/button';
import { useContext, useMemo, useState } from 'react';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { WorkspaceMember } from '@/lib/types';
import WorkspaceInvites from './workspaceInvite';
import WorkspaceMemberProfile from './workspaceMemberProfile';
import Image from 'next/image';
import { gql, useQuery } from '@apollo/client';
import LinearSkeleton from '@/components/general/linearSkeleton';

export default function WorkspaceMembers() {
  const [showInvites, setShowInvites] = useState(false);
  const { members, loading, error } = useWorkspaceMembers();
  const [memberProfile, setMemberProfile] = useState<WorkspaceMember | undefined>();
  const membersComponent = useMemo(
    () => <MembersSection members={members} isLoading={loading} setMemberProfile={setMemberProfile} />,
    [members]
  );

  if (loading) return <LinearSkeleton />;
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
            {showInvites ? 'View Members' : 'View Invites'}
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
  members: any[];
  isLoading: boolean;
  setMemberProfile: (member: WorkspaceMember | undefined) => void;
}) {
  if (isLoading) return <LinearSkeleton />;
  const acitveMembers = members;
  return (
    <div className=' flex w-full flex-col  justify-start   gap-20 text-xs'>
      <div className=' flex w-full flex-col justify-start gap-4 overflow-x-scroll p-2  text-xs'>
        <h2 className='text-lg font-semibold'>Active Members</h2>

        <MembersTableView members={acitveMembers} setMemberProfile={setMemberProfile} />
      </div>
    </div>
  );
}

function useWorkspaceMembers() {
  const memberQuery = gql`
    query ($id: String!) {
      workspace(id: $id) {
        members {
          id
          email
          profile {
            firstName
            lastName
            avatar
          }
        }
      }
    }
  `;
  const { currentWorkspace } = useContext(OrbitContext);
  const { data, error, loading } = useQuery(memberQuery, {
    variables: { id: currentWorkspace },
  });

  return {
    members: data?.workspace?.members,
    loading,
    error,
  };
}

function MembersTableView({ members, setMemberProfile }: { members: WorkspaceMember[]; setMemberProfile: any }) {
  if (!members || members.length === 0) {
    return <div className='flex w-full justify-center p-4'>No members</div>;
  }

  return (
    <div className='secondary-surface flex w-full flex-col items-center justify-start overflow-x-scroll rounded border text-xs'>
      <div className='primary-surface flex w-full flex-shrink-0 justify-between gap-2 border-b p-2 text-left font-medium'>
        {Object.entries(members[0].profile).map(([key, value]) =>
          key === 'avatar' ? (
            <span className='w-8 flex-shrink-0 truncate'></span>
          ) : (
            <span className='min-w-24 flex-1 flex-shrink-0 truncate text-left'>{key}</span>
          )
        )}
      </div>
      {members?.map((member) => (
        <Button
          variant={'ghost'}
          className=' primary-surface flex w-full justify-between gap-2 border-b p-2 text-2xs  '
          onClick={() => setMemberProfile(members.find((m) => m.username === member.username))}
        >
          {Object.entries(member.profile).map(([key, value]) =>
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
