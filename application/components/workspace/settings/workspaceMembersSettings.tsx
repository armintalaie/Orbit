'use client';

import { Button } from '../../ui/button';
import { useContext, useMemo, useState } from 'react';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { WorkspaceMember } from '@/lib/types';
import WorkspaceMemberProfile from './workspaceMemberProfile';
import { gql, useQuery } from '@apollo/client';
import LinearSkeleton from '@/components/general/skeletons/linearSkeleton';
import WorkspaceMemberInviteModal from './workspaceInvite';

export default function WorkspaceMembers() {
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
          <WorkspaceMemberInviteModal members={members} />
        </div>

        {membersComponent}
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
  return (
    <div className=' flex w-full flex-col  justify-start   gap-20 text-xs'>
      <div className=' flex w-full flex-col justify-start gap-4 overflow-x-scroll p-2  text-xs'>
        <MembersTableView members={members} setMemberProfile={setMemberProfile} />
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
            username
            pronouns
            location
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
    <div className='tertiary-surface flex w-full flex-col items-center justify-start overflow-y-hidden overflow-x-scroll rounded border text-xs'>
      <div className=' flex w-full flex-shrink-0 justify-between gap-2 border-b p-2 text-left font-medium'>
        {Object.entries(members[0].profile).map(
          ([key, value]) =>
            key !== 'avatar' && (
              <span className='min-w-24 flex-1 flex-shrink-0 truncate text-left' key={key}>
                {key}
              </span>
            )
        )}
      </div>
      {members?.map((member) => (
        <Button
          key={member.id}
          variant={'ghost'}
          className=' secondary-surface flex w-full justify-between gap-2 rounded-none border-b p-2 text-2xs  '
          onClick={() => setMemberProfile(members.find((m) => m.id === member.id))}
        >
          {Object.entries(member.profile).map(
            ([key, value]) =>
              key !== 'avatar' && (
                <span className='min-w-24 flex-1 flex-shrink-0 truncate text-left' key={key}>
                  {value}
                </span>
              )
          )}
        </Button>
      ))}
    </div>
  );
}
