'use client';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { useContext } from 'react';
import { Button } from '../ui/button';
import { CheckIcon, HourglassIcon, LogInIcon, XIcon } from 'lucide-react';

export default function UserWorkspaces() {
  const { user } = useContext(OrbitContext);
  const { changeWorkspace } = useContext(OrbitContext);

  return (
    <div className=' flex w-full flex-col gap-2   '>
      {user.workspaces && (
        <div className=' primary-surface flex w-full flex-col gap-1 divide-y rounded-md border '>
          {user.workspaces
            // .filter((w) => visibleStatuses.includes(w.status))
            .map((workspace) => (
              <div className='flex w-full items-center gap-2   ' key={workspace.id}>
                <div className='flex w-12 items-center gap-2'>
                  {workspace.status === 'ACTIVE' ? (
                    <Button
                      variant={'ghost'}
                      onClick={() => {
                        changeWorkspace(workspace.id);
                      }}
                    >
                      <LogInIcon size={16} />
                    </Button>
                  ) : (
                    <div className='flex w-full items-center justify-center gap-2  text-sm '>
                      <HourglassIcon size={16} />
                    </div>
                  )}
                </div>
                <p className='flex flex-1 items-center gap-2  py-1'>{workspace.name}</p>
                <div className='flex  items-center justify-end  gap-2 px-4 py-1 text-sm'>
                  {workspace.status === 'ACTIVE' ? (
                    <p className='flex w-24 items-center justify-between gap-2 rounded-md border border-transparent  p-2 font-medium'>
                      <span className='flex  h-3 w-3 items-center gap-2 rounded-full border bg-teal-300'></span>
                      Active
                    </p>
                  ) : (
                    <div className='flex  items-center justify-end  gap-2  text-sm '>
                      <Button
                        className='h-fit w-24 justify-between gap-2 p-2 text-sm'
                        variant={'default'}
                        // onClick={() => respondToInvite(workspace.workspaceId, 'blocked')}
                      >
                        <XIcon size={16} />
                        Ignore
                      </Button>
                      <Button
                        className='h-fit w-24 justify-between gap-2 p-2 text-sm'
                        variant={'default'}
                        // onClick={() => respondToInvite(workspace.workspaceId, 'active')}
                      >
                        <CheckIcon size={16} />
                        Accept
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
