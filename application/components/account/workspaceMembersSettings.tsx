'use client';

import { Button } from '../ui/button';

import { useCallback, useContext, useMemo, useState } from 'react';
import useSWR from 'swr';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function WorkspaceMembers() {
  const { currentWorkspace } = useContext(OrbitContext);
  const [showInvites, setShowInvites] = useState(false);

  const { data, error, isLoading } = useSWR(
    `/api/v2/workspaces/${currentWorkspace.id}/members`,
    fetcher
  );

  const membersComponent = useMemo(
    () => <MembersSection members={data} isLoading={isLoading} />,
    [data]
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading members</div>;

  return (
    <div className='flex h-full w-full flex-col items-center gap-5 overflow-hidden'>
      <div className=' flex w-full flex-col   gap-5'>
        <div className=' flex w-full  justify-between   gap-5'>
          <div></div>
          <Button onClick={() => setShowInvites((prev) => !prev)}>
            {showInvites ? 'Close Invites' : 'Invite Member'}
          </Button>
        </div>

        {showInvites ? <WorkspaceInvites /> : membersComponent}
      </div>
    </div>
  );
}

function MembersSection({ members, isLoading }) {
  if (isLoading) return <div>Loading...</div>;

  const cleanData = useCallback((data) => {
    return data.map((member) => {
      return {
        firstName: member.firstName,
        lastName: member.lastName,
        displayName: member.displayName,
        pronouns: member.pronouns,
        location: member.location,
        username: member.username,
      };
    });
  }, []);

  const membersinfo = cleanData(members);

  return (
    <div className='secondary-surface flex w-full flex-col items-center   justify-start overflow-x-scroll rounded border text-xs'>
      <div className='primary-surface flex w-full flex-shrink-0 justify-between gap-4 border-b p-2 font-medium'>
        {Object.entries(membersinfo[0]).map(([key, value]) => (
          <span className='w-32  flex-shrink-0'>{key}</span>
        ))}
      </div>
      {membersinfo?.map((member) => (
        <div className=' primary-surface flex w-full justify-between gap-4 p-2  '>
          {Object.entries(member).map(([key, value]) => (
            <span className='w-32 flex-shrink-0'>{value}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

function WorkspaceInvites() {
  const roles = ['Admin', 'Member', 'Viewer'];
  return (
    <div className=' flex w-full flex-col gap-2  '>
      <div className='secondary-surface  flex w-full items-end  gap-5 rounded-md p-3 text-sm '>
        <p>Currently you can only invite one person at a time.</p>
      </div>
      <div className='primary-surface flex w-full items-end  gap-5 rounded-md border p-3 shadow-sm'>
        <div className=' flex w-full  gap-5 '>
          <div className='flex w-full flex-col gap-2'>
            <Label htmlFor='email'>Email</Label>
            <Input type='email' name='email' placeholder='john@email.com' />
          </div>
          <div className='flex w-full flex-col gap-2'>
            <Label htmlFor='role'>Role</Label>
            <Select>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Select a Role' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button>Invite</Button>
      </div>
    </div>
  );
}
