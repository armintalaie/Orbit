'use client';

import * as React from 'react';
import { CircleUser } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Profile {
  id: string | undefined;
  full_name: string;
  avatar_url: string;
  username: string;
}

const noAssignee: Profile = {
  id: '-1',
  full_name: 'Unassigned',
  avatar_url: '',
  username: '',
};

export function AssigneeUpdateField({ issueid, user, projectid }) {
  const [memberOptions, setMemberOptions] = React.useState<{
    [key: string]: Profile;
  }>({});
  const [open, setOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(
    user ? user.id : null
  );

  React.useEffect(() => {
    async function fetchMembers() {
      const res = await fetch(`/api/projects/${projectid}/members`, {
        next: { revalidate: 10 },
      });
      let members = await res.json();
      members = members.map(
        (member: { profile: Profile; memberid: string }) => ({
          ...member.profile,
          id: member.memberid,
        })
      );

      const options: { [key: string]: Profile } = {};
      options[noAssignee.id as string] = noAssignee;
      for (const member of members) {
        options[member.id] = {
          ...member,
        };
      }
      setMemberOptions(options);
    }
    fetchMembers();
  }, []);

  async function updateAssignee(id) {
    if (!id) {
      fetch(`/api/issues/${issueid}/assignees`, {
        method: 'DELETE',
      }).then(() => {
        setSelectedStatus(null);
      });
    } else {
      await fetch(`/api/issues/${issueid}/assignees`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: id }),
      });
    }
  }

  return (
    <div className='flex items-center space-x-4'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className='justify-start gap-2 p-0 text-xs'
          >
            {selectedStatus ? (
              <>
                <CircleUser className=' h-4 w-4 shrink-0 ' />
                {memberOptions &&
                  memberOptions[selectedStatus] &&
                  memberOptions[selectedStatus].full_name}
              </>
            ) : (
              <>
                <CircleUser className=' h-4 w-4 shrink-0' />
                <span>Unassigned</span>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0' side='right' align='start'>
          <Command
            filter={(value, search) => {
              if (!value) {
                return 0;
              }
              return memberOptions[value].full_name
                .toLowerCase()
                .indexOf(search.toLowerCase()) !== -1
                ? 1
                : 0;
            }}
          >
            <CommandInput placeholder='Change Assignee...' />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {Object.entries(memberOptions).map(([key, member]) => (
                  <CommandItem
                    key={member.id}
                    value={member.id}
                    onSelect={(value) => {
                      const matchId =
                        Object.keys(memberOptions).find((m) => m === value) ||
                        null;
                      if (!matchId) {
                        setSelectedStatus(null);
                        return;
                      }
                      const found = memberOptions[matchId as string];
                      setSelectedStatus(found.id);
                      updateAssignee(found.id).then(() => {
                        setOpen(false);
                      });
                    }}
                  >
                    <CircleUser className='mr-2 h-4 w-4 shrink-0' />

                    <span>{member.full_name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
