'use client';
import { useContext } from 'react';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export default function WorkspaceSwitcher() {
  const { changeWorkspace, currentWorkspace, user } = useContext(OrbitContext);

  return (
    <Select
      value={currentWorkspace}
      onValueChange={(e) => {
        changeWorkspace(e);
      }}
    >
      <SelectTrigger className='primary-surface  h-8 w-full rounded-xl p-1 px-2 text-sm'>
        <SelectValue className='text-xs' placeholder='Select a workspace' />
      </SelectTrigger>
      <SelectContent className='flex w-full flex-col gap-4 border-none bg-transparent shadow-none'>
        <div className='flex flex-col gap-2 text-sm'>
          {user &&
            user.workspaces.map((workspace) => (
              <SelectItem
                className='primary-surface flex items-center gap-2 rounded-xl border p-1 px-4 shadow-sm '
                value={workspace.id}
                key={workspace.id}
                onClick={() => changeWorkspace(workspace.id)}
              >
                <span>{workspace.name}</span>
              </SelectItem>
            ))}
        </div>
      </SelectContent>
    </Select>
  );
}
