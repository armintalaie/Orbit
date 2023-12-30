'use client';

import { useContext, useEffect, useState } from 'react';
import { CircleUser, UserCircleIcon } from 'lucide-react';
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
import { UserSessionContext } from '@/lib/context/AuthProvider';

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

export function AssigneeField({ field }: { field: any }) {
  const user = useContext(UserSessionContext);
  const [memberOptions, setMemberOptions] = useState<{
    [key: string]: Profile;
  }>({});
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(
    field.value
  );

  useEffect(() => {
    async function fetchMembers() {
      const res = await fetch(`/api/profiles`, {
        headers: {
          Authorization: `${user?.access_token}`,
        },
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
  return (
    <div className='flex items-center space-x-4'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='line-clamp-1 flex h-8 w-fit justify-start overflow-hidden text-2xs text-gray-800'
          >
            {selectedStatus && selectedStatus !== noAssignee.id ? (
              <>
                <CircleUser className='mr-2 h-4 w-4 shrink-0' />
                {memberOptions &&
                  memberOptions[selectedStatus] &&
                  memberOptions[selectedStatus].full_name}
              </>
            ) : (
              <div className=' flex text-xs'>
                <UserCircleIcon className='mr-2 h-4 w-4 shrink-0' />
                Assignee
              </div>
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
            <CommandInput placeholder='Change assignee...' />
            <CommandList>
              <CommandEmpty>No member found.</CommandEmpty>
              <CommandGroup>
                {Object.entries(memberOptions).map(([key, member]) => (
                  <CommandItem
                    key={member.id}
                    value={member.id}
                    onSelect={(value) => {
                      const matchId =
                        Object.keys(memberOptions).find((m) => m === value) ||
                        null;
                      if (
                        !matchId ||
                        !memberOptions[matchId as string] ||
                        !memberOptions[matchId as string].id
                      ) {
                        setSelectedStatus(null);
                        field.onChange(null);
                      } else {
                        const found = memberOptions[matchId as string];
                        field.onChange(found.id);
                        setSelectedStatus(found.id || null);
                      }

                      setOpen(false);
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
