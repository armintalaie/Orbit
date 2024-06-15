import { Button } from '@/components/ui/button';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { WorkspaceMember } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useContext } from 'react';
import { gql, useMutation } from '@apollo/client';

const REMOVE_MEMBER_MUTATION = gql`
  mutation removeWorkspaceMember($userId: String!, $workspaceId: String!) {
    removeWorkspaceMember(userId: $userId, workspaceId: $workspaceId) {
      status
    }
  }
`;

export default function WorkspaceMemberProfile({
  member,
  setMemberProfile,
}: {
  member: WorkspaceMember;
  setMemberProfile: (member: WorkspaceMember | undefined) => void;
}) {
  const { currentWorkspace } = useContext(OrbitContext);
  const [removeFromWorkspace, { data, loading, error }] = useMutation(REMOVE_MEMBER_MUTATION);
  const { id, email, profile } = member;
  const { avatar, ...rest } = profile;

  async function removeMember() {
    removeFromWorkspace({
      variables: {
        userId: id,
        workspaceId: currentWorkspace,
      },
    }).then((res) => {
      if (res.data) {
        setMemberProfile(undefined);
      } else {
        console.log('Failed to remove member');
      }
    });
  }
  return (
    <div className='flex h-full w-full flex-col items-center gap-5 '>
      <div className=' flex w-full flex-col gap-5'>
        <div className=' flex w-full gap-2 text-sm'>
          <Button
            size={'icon'}
            variant={'ghost'}
            onClick={() => {
              setMemberProfile(undefined);
            }}
          >
            <ArrowLeft size={16} />
          </Button>
          <div className='flex flex-1 flex-col items-center gap-2'></div>
          <Button size={'xs'} variant={'destructive'} className='text-xs' onClick={removeMember}>
            Remove from Workspace
          </Button>
        </div>

        <div className=' flex w-full flex-col items-center justify-start gap-4 overflow-x-scroll text-xs'>
          <div className='flex items-center gap-2'>
            <Image
              src={profile.avatar}
              alt='avatar'
              width={150}
              height={150}
              className='primary-surface rounded-full border-2 p-2 shadow-sm'
            />
          </div>

          <div className=' secondary-surface flex w-full flex-col justify-between gap-2 divide-y rounded-md border text-muted-foreground  '>
            <div className='  flex w-full justify-between gap-2 p-2  '>
              <span className='w-28 flex-shrink-0  truncate'>id</span>
              <span className='w-full flex-shrink-0  truncate'>{id}</span>
            </div>
            <div className='  flex w-full justify-between gap-2 p-2  '>
              <span className='w-28 flex-shrink-0  truncate'>email</span>
              <span className='w-full flex-shrink-0  truncate'>{email}</span>
            </div>
          </div>
          <div className=' secondary-surface flex w-full flex-col justify-between gap-2 divide-y rounded-md border   '>
            {Object.entries(rest).map(([key, value]) => (
              <div className='  flex w-full justify-between gap-2 p-2  ' key={key}>
                <span className='w-28 flex-shrink-0  truncate'>{key}</span>
                <span className='w-full flex-shrink-0  truncate'>{value ? value.toString() : 'N/A'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
