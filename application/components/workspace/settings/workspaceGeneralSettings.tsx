'use client';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { useContext, useState } from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { UserSessionContext } from '@/lib/context/AuthProvider';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function WorkspaceGeneralSettings() {
  const { currentWorkspace, changeWorkspace } = useContext(OrbitContext);
  const userSession = useContext(UserSessionContext);
  const [name, setName] = useState(currentWorkspace?.name);
  const router = useRouter();

  async function renameWorkspace(name: string) {
    const res = await fetch(`/api/v2/workspaces/${currentWorkspace.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userSession.access_token}`,
      },
      body: JSON.stringify({
        name,
      }),
    });

    if (res.ok) {
      toast('Workspace renamed successfully');
      changeWorkspace(currentWorkspace.id);
    } else {
      toast('Failed to rename workspace');
    }
  }

  async function deleteWorkspace() {
    const res = await fetch(`/api/v2/workspaces/${currentWorkspace.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userSession.access_token}`,
      },
    });

    if (res.ok) {
      toast('Workspace deleted successfully');
      router.refresh();
      changeWorkspace(null);
    } else {
      toast('Failed to delete workspace');
    }
  }

  async function leaveWorkspace() {
    const res = await fetch(`/api/v2/workspaces/${currentWorkspace.id}/members/${userSession.user.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userSession.access_token}`,
      },
    });

    if (res.ok) {
      toast('Left workspace successfully');
      router.refresh();
      changeWorkspace(null);
    } else {
      toast('Failed to leave workspace');
    }
  }

  return (
    <div className='flex w-full flex-col gap-4'>
      <div className='secondary-surface flex flex-col gap-4 rounded p-4'>
        <p className='text-sm'>Manage your workspace settings</p>
      </div>
      <div className='flex w-full flex-col gap-4 pb-10 pt-5'>
        <h2 className='text-lg  font-semibold'>Workspace</h2>
        <div className='flex  w-full items-end gap-4'>
          <div className='flex items-center gap-4 '>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <Button onClick={() => renameWorkspace(name)} disabled={name === currentWorkspace?.name}>
            Save
          </Button>
        </div>
      </div>
      <div className='flex flex-col gap-4 border-t py-4'>
        <h3 className='text-md  font-medium'>Workspace Member</h3>
        <div className='secondary-surface flex flex-col items-end gap-4 rounded-md p-4 py-4'>
          <p className='w-full text-sm'>
            Leaving a workspace will remove you from the workspace. You will need to be re-invited to join the workspace
            again. This will remove all your data associated with the workspace.
          </p>
          <Button className='w-fit' variant={'destructive'} onClick={leaveWorkspace}>
            Leave Workspace
          </Button>
        </div>
      </div>
      <div className='flex flex-col gap-4 border-t py-4'>
        <h3 className='text-md  font-medium'>Danger</h3>
        <div className='secondary-surface flex flex-col items-end gap-4 rounded-md p-4 py-4'>
          <p className='w-full text-sm'>
            Deleting a workspace is irreversible. All data associated with the workspace will be lost. This includes
            members, data, and projects. Please be sure before deleting a workspace.
          </p>
          <Button className='w-fit' variant={'destructive'} onClick={deleteWorkspace}>
            Delete Workspace
          </Button>
        </div>
      </div>
    </div>
  );
}
