'use client';

import * as React from 'react';
import { UserIcon } from 'lucide-react';
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
import { useContext } from 'react';
import { OrbitContext } from '@/lib/context/OrbitContext';
import AssigneeAvatar from './projects/AssigneeAvatar';

interface Profile {
  id: string | undefined;
  full_name: string;
  avatar_url: string;
  username: string;
  label: string;
}

export function UserFinder({
  val,
  setVal,
  teamid,
}: {
  val: string;
  setVal: Function;
  teamid: number;
}) {
  const [memberOptions, setMemberOptions] = React.useState<{
    [key: string]: Profile;
  }>({});
  const [open, setOpen] = React.useState(false);

  const { fetcher } = useContext(OrbitContext);

  async function fetchMembers() {
    const res = await fetcher(`/api/profiles/`, {
      next: { revalidate: 10 },
      headers: {
        'cache-control': 'no-cache',
      },
      cache: 'no-cache',
    });
    const profiles = await res.json();
    const options: { [key: string]: Profile } = {};

    for (const profile of profiles) {
      options[profile.id] = {
        ...profile,
        label: profile.full_name,
      };
    }
    setMemberOptions(options);
  }

  React.useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className='flex items-center space-x-4'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='outline' size='sm' className='w-full justify-start'>
            {val ? (
              <>
                <AssigneeAvatar
                  assignee={memberOptions[val] as any}
                  formatting={{
                    showFullName: true,
                    showEmail: true,
                    leftAlign: false,
                  }}
                />
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
              if (!memberOptions[value]) {
                return 0;
              }
              return memberOptions[value].full_name
                .toLowerCase()
                .indexOf(search.toLowerCase()) !== -1
                ? 1
                : 0;
            }}
          >
            <CommandInput placeholder='search profiles...' />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {Object.entries(memberOptions).map(([, member]) => (
                  <CommandItem
                    key={member.id}
                    value={member.id}
                    onSelect={(value) => {
                      setVal(value);
                      setOpen(false);
                    }}
                  >
                    <AssigneeAvatar
                      assignee={member as any}
                      formatting={{
                        showFullName: true,
                        showEmail: true,
                        leftAlign: false,
                      }}
                    />
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

export function MentionUserFinder({ val, setVal, teamid }) {
  const [memberOptions, setMemberOptions] = React.useState<{
    [key: string]: Profile;
  }>({});
  const [open, setOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(
    null
  );
  const { fetcher } = useContext(OrbitContext);

  React.useEffect(() => {
    async function fetchMembers() {
      const res = await fetcher(`/api/profiles/`, {
        next: { revalidate: 10 },
      });
      const profiles = await res.json();
      const options: { [key: string]: Profile } = {};

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
    <div className='flex items-center space-x-4'>
      <Command
        filter={(value, search) => {
          if (!value) {
            return 0;
          }
          if (!memberOptions[value]) {
            return 0;
          }
          return memberOptions[value].full_name
            .toLowerCase()
            .indexOf(search.toLowerCase()) !== -1
            ? 1
            : 0;
        }}
      >
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
        </CommandList>
      </Command>
    </div>
  );
}
