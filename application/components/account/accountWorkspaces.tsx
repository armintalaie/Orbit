import { UserSessionContext } from '@/lib/context/AuthProvider';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { useContext, useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { UserInfoType } from '@/lib/types';
import Spinner from '../general/Spinner';
import { CheckIcon, HourglassIcon, LogInIcon, XIcon } from 'lucide-react';

export default function AccountWorkspaces() {
  const [showNewWorkspace, setShowNewWorkspace] = useState(false);

  return (
    <div className='flex h-full w-full flex-col items-center gap-5 overflow-hidden'>
      <div className=' flex w-full  items-center gap-5 rounded-md '>
        <p className=' flex-1 text-left text-sm'></p>
        <Button onClick={() => setShowNewWorkspace(!showNewWorkspace)} className='flex items-center gap-2 '>
          {showNewWorkspace ? 'Cancel' : 'New Workspace'}
        </Button>
      </div>
      {showNewWorkspace ? <NewWorkspace onEvent={setShowNewWorkspace} /> : <UserWorkspaces />}
    </div>
  );
}

function NewWorkspace({ onEvent }: { onEvent: (value: boolean) => void }) {
  const UserSession = useContext(UserSessionContext);
  const router = useRouter();
  const [name, setName] = useState('');

  async function createWorkspace() {
    const res = await fetch('/api/v2/workspaces', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${UserSession.access_token}`,
      },
      body: JSON.stringify({
        workspaceId: name,
      }),
    });

    if (res.ok) {
      toast('Workspace created');
      onEvent(false);
      router.refresh();
    } else {
      const data = await res.json();
      toast(data.error);
    }
  }
  return (
    <div className='primary-surface flex w-full flex-col gap-4 rounded-md border '>
      <div className=' flex w-full flex-col justify-center gap-4 rounded-md p-4'>
        <div className='flex flex-col gap-2 '>
          <Label>Name</Label>
          <div className='flex flex-1 flex-col gap-2'>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
            <p className='pl-2 text-xs  '>
              Workspace names are be unique, and only contain letters, numbers, and spaces.
            </p>
            <p className='pl-2 text-xs  '>You can change this later.</p>
          </div>
        </div>
        <div className='flex w-full justify-end gap-2'>
          <Button onClick={createWorkspace}>Create</Button>
        </div>
      </div>
    </div>
  );
}

function UserWorkspaces() {
  const UserSession = useContext(UserSessionContext);
  const { changeWorkspace } = useContext(OrbitContext);
  const router = useRouter();

  const { userInfo, isLoading, error } = useUserInfo();

  async function respondToInvite(workspaceId: string, status: string) {
    const res = await fetch(`/api/v2/users/${UserSession.user.id}/invites/${workspaceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${UserSession.access_token}`,
      },
      body: JSON.stringify({
        status: status,
      }),
    });
    if (res.ok) {
      toast('Invite responded');
    } else {
      toast('Failed to respond to invite');
    }
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Failed to load workspaces</div>;
  }

  const visibleStatuses = ['active', 'pending', ''];
  return (
    <div className=' flex w-full flex-col gap-2   '>
      {userInfo.workspaces && userInfo.workspaces.length > 0 && (
        <div className=' primary-surface flex w-full flex-col gap-1 divide-y rounded-md border '>
          {userInfo.workspaces
            .filter((w) => visibleStatuses.includes(w.status))
            .map((workspace) => (
              <div className='flex w-full items-center gap-2   ' key={workspace.workspaceId}>
                <div className='flex w-12 items-center gap-2'>
                  {workspace.status === 'active' ? (
                    <Button
                      variant={'ghost'}
                      onClick={() => {
                        changeWorkspace(workspace.workspaceId);
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
                  {workspace.status === 'active' ? (
                    <p className='flex w-24 items-center justify-between gap-2 rounded-md border border-transparent  p-2 font-medium'>
                      <div className='flex  h-3 w-3 items-center gap-2 rounded-full border bg-teal-300'></div>
                      Active
                    </p>
                  ) : (
                    <div className='flex  items-center justify-end  gap-2  text-sm '>
                      <Button
                        className='h-fit w-24 justify-between gap-2 p-2 text-sm'
                        variant={'default'}
                        onClick={() => respondToInvite(workspace.workspaceId, 'blocked')}
                      >
                        <XIcon size={16} />
                        Ignore
                      </Button>
                      <Button
                        className='h-fit w-24 justify-between gap-2 p-2 text-sm'
                        variant={'default'}
                        onClick={() => respondToInvite(workspace.workspaceId, 'active')}
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

function useUserInfo() {
  const UserSession = useContext(UserSessionContext);
  const { data, error, isLoading } = useSWR(`/api/v2/users/${UserSession.user.id}`, async (url: string) => {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${UserSession.access_token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  });
  return {
    userInfo: data as UserInfoType,
    isLoading,
    error,
  };
}
