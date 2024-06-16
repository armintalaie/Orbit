'use client';

import { UserIcon } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '../../ui/button';
import { cn } from '@/lib/utils';
import { MemberCard } from '@/components/workspace/teams/team/pageSections/teamMembersTab';

interface Profile {
  id: string | undefined;
  full_name: string;
  avatar_url: string;
  username: string;
  label: string;
}

export function UserFinder({ field, users }: { field: any; users: Profile[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className=' w-80 max-w-2xl justify-start'>
          {field.value ? (
            <>{field.value}</>
          ) : (
            <span className='flex gap-2 text-xs font-normal text-neutral-400 dark:text-neutral-600'>
              <UserIcon className='h-4 w-4' />
              Search users
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-80 w-full max-w-2xl p-0')} side='bottom' align='start'>
        <Command className={'text-xs'}>
          <CommandInput className={'text-xs'} placeholder='search profiles...' />
          <CommandList className={'min-h-40'}>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {users.map((member) => (
                <CommandItem
                  key={member.id}
                  value={member.profile.firstName}
                  onSelect={(value) => {
                    setOpen(false);
                  }}
                >
                  <MemberCard member={member} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
