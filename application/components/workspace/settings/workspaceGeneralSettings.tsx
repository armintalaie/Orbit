'use client';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { useContext, useState } from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';

export default function WorkspaceGeneralSettings() {
  const { currentWorkspace, changeWorkspace, workspace } = useContext(OrbitContext);
  const [name, setName] = useState(workspace.name);

  async function renameWorkspace(name: string) {}

  async function deleteWorkspace() {}

  async function leaveWorkspace() {}

  return (
    <div className='flex w-full flex-col gap-4'>
      <div className='flex w-full flex-col gap-4 pb-10 pt-5'>
        <h2 className='text-lg  font-semibold'>Configuration</h2>
        <div className='flex  w-full items-end gap-4'>
          <div className='flex w-full items-center gap-4 '>
            <Label>Name</Label>
            <Input className={'w-full'} disabled={true} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <Button onClick={() => renameWorkspace(name)} disabled={true}>
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
