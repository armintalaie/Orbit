import { UserSessionContext } from '@/lib/context/AuthProvider';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { useContext, useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function AccountWorkspaces() {
  const [showNewWorkspace, setShowNewWorkspace] = useState(false);

  return (
    <div className='flex h-full w-full flex-col items-center gap-5 overflow-hidden'>
      <div className=' flex w-full  items-center gap-5 rounded-md '>
        <p className=' flex-1 text-left text-sm'></p>
        <Button
          onClick={() => setShowNewWorkspace(!showNewWorkspace)}
          className='flex items-center gap-2 '
        >
          {showNewWorkspace ? 'Cancel' : 'New Workspace'}
        </Button>
      </div>
      {showNewWorkspace ? (
        <NewWorkspace onEvent={setShowNewWorkspace} />
      ) : (
        <UserWorkspaces />
      )}
    </div>
  );
}

function NewWorkspace({ onEvent }) {
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
      body: JSON.stringify({ workspaceId: name }),
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
    <div className='flex w-full flex-col gap-4 border-t'>
      <p className='text-md py-2 font-medium'>Create a new workspace</p>
      <div className='secondary-surface flex w-full flex-col justify-center gap-4 rounded-md p-4'>
        <div className='flex items-center gap-8 '>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          <Button onClick={createWorkspace}>Create</Button>
        </div>
        <p className='text-xs  '>
          workspace names must be unique, and can only contain letters, numbers,
          and spaces with at least 3 characters.
        </p>
      </div>
    </div>
  );
}

function UserWorkspaces() {
  const UserSession = useContext(UserSessionContext);
  const [userInfo, setUserInfo] = useState(null);
  const { changeWorkspace } = useContext(OrbitContext);

  async function getUserInfo() {
    const res = await fetch(`/api/v2/users/${UserSession.user.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${UserSession.access_token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setUserInfo(data);
    }
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  if (!userInfo) {
    return <div></div>;
  }

  return (
    <div className='secondary-surface flex w-full flex-col  gap-5 rounded-md p-5'>
      <h3>Your workspaces</h3>
      <div className='flex w-full flex-col gap-2'>
        {userInfo.workspaces.map((workspace) => (
          <div className='flex w-full items-center gap-2 rounded border p-1'>
            <Button
              className='flex w-40 items-center gap-2  py-2'
              key={workspace.id}
              onClick={() => changeWorkspace(workspace.workspaceId)}
            >
              {workspace.name}
            </Button>
            <div
              className='flex w-40 items-center gap-2  py-2'
              key={workspace.id}
              // onClick={() => changeWorkspace(workspace.workspaceId)}
            >
              <Button
                variant={'outline'}
                className='flex w-full items-center gap-2 '
              >
                {workspace.status === 'active' ? 'Active' : 'Accept'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
