'use client';

import * as React from 'react';
import { ArrowLeftCircle, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { OrbitContext } from '@/lib/context/OrbitContext';
import { useContext } from 'react';

interface Profile {
  id: string | undefined;
  full_name: string;
  avatar_url: string;
  username: string;
  label: string;
}

export function UserFilter({ val, setVal, teamid, backBtn }) {
  const [memberOptions, setMemberOptions] = React.useState<{
    [key: string]: Profile;
  }>({});
  const [open, setOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(null);

  const { fetcher } = useContext(OrbitContext);

  React.useEffect(() => {
    async function fetchMembers() {
      const res = await fetcher(`/api/profiles/`, {
        next: {
          revalidate: 10,
        },
      });
      const profiles = await res.json();
      const options: {
        [key: string]: Profile;
      } = {};

      for (const profile of profiles) {
        options[profile.id] = {
          ...profile,
          label: profile.full_name,
        };
      }
      setMemberOptions(options);
    }

    fetchMembers();
  }, []);

  return (
    <Command
      filter={(value, search) => {
        if (!value) {
          return 0;
        }
        if (!memberOptions[value]) {
          return 0;
        }
        return memberOptions[value].full_name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ? 1 : 0;
      }}
    >
      <CommandInput placeholder='Search...' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Object.entries(memberOptions).map(([key, member]) => (
            <CommandItem
              key={member.id}
              value={member.id}
              onSelect={(value) => {
                const match = Object.values(memberOptions).find((m) => m.id === value);
                if (match) {
                  setSelectedStatus(match.full_name as string);
                } else {
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
        <Button
          variant='ghost'
          onClick={backBtn}
          className='h-full w-full rounded-none rounded-b-lg border-t border-t-gray-100 p-2 '
        >
          <ArrowLeftCircle className='h-4 w-4' />
        </Button>
      </CommandList>
    </Command>
  );
}
