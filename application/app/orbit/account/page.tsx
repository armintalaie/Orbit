'use client';

import { toast } from 'sonner';
import { useContext, useEffect, useState } from 'react';
import { UserSessionContext } from '@/lib/context/AuthProvider';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function Account() {
  const UserSession = useContext(UserSessionContext);
  const user = UserSession.user;
  const [userInfo, setUserInfo] = useState(null);

  const getUserInfo = async () => {
    const res = await fetch(`/api/v2/users/${user.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${UserSession.access_token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      console.log(data);
      setUserInfo(data);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className='flex h-screen w-screen flex-col items-center  p-10'>
      <div className='flex w-full max-w-xl flex-col gap-4 divide-y py-5'>
        <h1 className='py-10 text-2xl font-semibold'>Account</h1>

        <section className='flex w-full flex-col gap-4 py-5 '>
          <div className='flex items-center gap-4'>
            <h2 className='text-lg font-semibold'>Profile</h2>
            <Button
              // onClick={signout}
              variant='outline'
              className='rounded-sm px-2 py-0 text-sm'
              type='button'
            >
              Sign out
            </Button>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <label htmlFor='name' className='text-sm font-semibold'>
                Email
              </label>
              <p>{user.email}</p>
            </div>
          </div>
        </section>

        <section className='flex w-full flex-col gap-4 py-5 '>
          <div className='flex items-center gap-4'>
            <h2 className='text-lg font-semibold'>Workspaces</h2>
            <CreateWorkspace />
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex max-w-lg flex-col items-center gap-2'>
              {userInfo &&
                userInfo.workspaces.map((workspace) => (
                  <div
                    key={workspace.id}
                    className='flex w-full items-center justify-between gap-2 rounded border bg-neutral-800 p-2'
                  >
                    <p>{workspace.name}</p>
                    <p className='text-sm'>
                      Updated:{' '}
                      {new Date(workspace.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function CreateWorkspace() {
  const [name, setName] = useState('');
  const UserSession = useContext(UserSessionContext);
  async function createWorkspace() {
    const res = await fetch(`/api/v2/workspaces`, {
      method: 'POST',
      body: JSON.stringify({ workspaceId: name }),
      headers: {
        Authorization: `Bearer ${UserSession.access_token}`,
      },
    });
    console.log(res);
    const data = await res.json();
    if (res.ok) {
      toast('Workspace created');
    } else {
      toast(data.error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='rounded-sm px-2 py-0 text-sm'
          type='button'
        >
          Create workspace
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>New workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace to start collaborating.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='flex items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Name
            </Label>
            <Input
              className='w-full'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type='submit'
            onClick={(e) => {
              console.log(e);
              e.preventDefault();
              toast('Creating workspace');
              createWorkspace();
            }}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
