import { Button } from '@/components/ui/button';
import { UserSessionContext } from '@/lib/context/AuthProvider';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { WorkspaceMember } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useContext } from 'react';
import { toast } from 'sonner';

export default function WorkspaceMemberProfile({
  member,
  setMemberProfile,
}: {
  member: WorkspaceMember;
  setMemberProfile: (member: WorkspaceMember | undefined) => void;
}) {
  const { currentWorkspace } = useContext(OrbitContext);
  const userSession = useContext(UserSessionContext);
  const { avatar, ...rest } = member;

  async function removeMember() {
    const res = await fetch(`/api/v2/workspaces/${currentWorkspace.id}/members/${member.memberId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userSession.access_token}`,
      },
    });
    if (res.ok) {
      toast('Member removed successfully');
      setMemberProfile(undefined);
    } else {
      toast('Failed to remove member');
    }
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
          <Button className='text-xs' onClick={() => {}} disabled>
            Adjust Roles
          </Button>
          <Button variant={'destructive'} className='text-xs' onClick={removeMember}>
            Remove from Workspace
          </Button>
        </div>

        <div className=' flex w-full flex-col items-center justify-start gap-4 overflow-x-scroll text-xs'>
          <div className='flex items-center gap-2'>
            <Image
              src={avatar}
              alt='avatar'
              width={150}
              height={150}
              className='primary-surface rounded-full border-2 p-2 shadow-sm'
            />
          </div>
          <div className=' primary-surface flex w-full flex-col justify-between gap-2 divide-y rounded-md border p-2  '>
            {Object.entries(rest).map(([key, value]) => (
              <div className=' primary-surface flex w-full justify-between gap-2 p-2  '>
                <span className='w-28 flex-shrink-0  truncate'>{key}</span>
                <span className='w-full flex-shrink-0  truncate'>{value.toString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
