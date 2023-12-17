'use client';

import * as React from 'react';
import {
  ArrowUpCircle,
  CheckCircle2,
  Circle,
  HelpCircle,
  LucideIcon,
  UserIcon,
  XCircle,
} from 'lucide-react';

import { cn } from '@/lib/utils';
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
  label: string;
}

export function UserFinder({ val, setVal, teamid }) {
  const [memberOptions, setMemberOptions] = React.useState<{
    [key: string]: Profile;
  }>({}); // [key: string, value: Profile][
  const [open, setOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    async function fetchMembers() {
      const res = await fetch(`/api/profiles/`, {
        next: { revalidate: 10 },
      }); //TODO
      const profiles = await res.json();
      const options: { [key: string]: Profile } = {};

      for (const profile of profiles) {
        options[profile.id] = {
          ...profile,
          label: profile.full_name,
        };
      }
      console.log('members: ', profiles);
      setMemberOptions(options);
      console.log(options);
    }

    fetchMembers();
  }, []);

  return (
    <div className='flex items-center space-x-4'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='outline' size='sm' className='w-full justify-start'>
            {selectedStatus ? (
              <>
                <UserIcon className='mr-2 h-4 w-4 shrink-0' />
                {/* <selectedStatus.icon className='mr-2 h-4 w-4 shrink-0' /> */}
                {selectedStatus}
              </>
            ) : (
              <>+ Search Profiles</>
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
              return memberOptions[value].full_name
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
                    key={member.id}
                    value={member.id}
                    onSelect={(value) => {
                      const match = Object.values(memberOptions).find(
                        (m) => m.id === value
                      );
                      if (match) {
                        console.log('match: ', match);
                        setSelectedStatus(match.full_name as string);
                      } else {
                        console.log('no match');
                        setSelectedStatus(null);
                      }
                      setVal(value);
                      setOpen(false);
                    }}
                  >
                    <UserIcon className='mr-2 h-4 w-4 shrink-0' />

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
