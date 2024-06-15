import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserFinder } from '@/components/workspace/util/userFinder';
import { useContext } from 'react';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';

export default function AddMember({ team }: { team: any }) {
  const { workspace } = useContext(OrbitContext);
  const { members } = workspace;
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant='outline' size='xs'>
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className='h-full max-h-[500px] w-full max-w-2xl'>
        <div className='flex flex-col gap-4 p-1 px-4'>
          <div className='flex flex-row items-center justify-between'>
            <h1 className='text-md medium'>Add Member</h1>
          </div>
          <div className='flex flex-col items-center gap-4'>
            <UserFinder field={{}} users={members} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
