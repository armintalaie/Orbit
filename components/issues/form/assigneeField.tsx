'use client';

import * as React from 'react';
import {
  UserIcon,
} from 'lucide-react';

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
  memberid: string | undefined;
  profile: {
    full_name: string;
    avatar_url: string;
    username: string;
  };
  label: string;
}

const noAssignee: Profile = {
  memberid: '-1',
  profile: {
    full_name: 'Unassigned',
    avatar_url: '',
    username: '',
  },
  label: 'Unassigned',
};

export function AssigneeField({ field, projectid }) {
  const [memberOptions, setMemberOptions] = React.useState<{
    [key: string]: Profile;
  }>({}); // [key: string, value: Profile][
  const [open, setOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(
    field.value
  );

  React.useEffect(() => {
    async function fetchMembers() {
      const res = await fetch(`/api/projects/${projectid}/members`, {
        next: { revalidate: 10 },
      });
      const members = await res.json();
      const options: { [key: string]: Profile } = {};
      options[noAssignee.memberid as string] = noAssignee;
      for (const member of members) {
        options[member.memberid] = {
          ...member,
          label: member.profile.full_name,
        };
      }
      console.log('members: ', members);
      setMemberOptions(options);
      console.log(options);
    }

    fetchMembers();
  }, []);

  return (
    <div className='flex items-center space-x-4'>
      {/* <p className="text-sm text-muted-foreground">Status</p> */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='w-[150px] justify-start'
          >
            {selectedStatus ? (
              <>
                <UserIcon className='mr-2 h-4 w-4 shrink-0' />
                {/* <selectedStatus.icon className='mr-2 h-4 w-4 shrink-0' /> */}
                {selectedStatus}
              </>
            ) : (
              <>+ Set Assignee</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0' side='right' align='start'>
          <Command
            filter={(value, search) => {
              if (!value) {
                return 0;
              }
              console.log('value: ', value);
              console.log('search: ', search);
              console.log('memberOptions: ', memberOptions);
              console.log('memberOptions[value]: ', memberOptions[value].label);
              return memberOptions[value].profile.full_name
                .toLowerCase()
                .indexOf(search.toLowerCase()) !== -1
                ? 1
                : 0;
            }}
          >
            <CommandInput placeholder='Change status...' />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {Object.entries(memberOptions).map(([key, member]) => (
                  <CommandItem
                    key={member.memberid}
                    value={member.memberid}
                    onSelect={(value) => {
                      setSelectedStatus(
                        memberOptions.find(
                          (m) => m.profile.memberid === value
                        ) || null
                      );
                      field.onChange(value);
                      setOpen(false);
                    }}
                  >
                    <UserIcon className='mr-2 h-4 w-4 shrink-0' />

                    <span>{member.profile.full_name}</span>
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
