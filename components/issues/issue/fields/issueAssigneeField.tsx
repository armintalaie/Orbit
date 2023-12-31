'use client';

import { useState, useEffect } from 'react';
import { CircleUser, UserSquare2Icon, UsersRoundIcon } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  username: string;
}

type AssigneeUpdateFieldProps = {
  issueId: number;
  user: Profile | null;
  team: {
    id: number;
    title: string;
  };
};

export function IssueAssigneeField(props: AssigneeUpdateFieldProps) {
  const { issueId, user, team } = props;
  const [memberOptions, setMemberOptions] = useState<{
    [key: string]: Profile;
  }>({});
  const [open, setOpen] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState<string | null>(
    user ? user.id : null
  );

  const fetchMembers = async () => {
    const res = await fetch(`/api/teams/${team.id}/members`, {
      next: { revalidate: 30 },
    });
    let members = await res.json();
    const options: { [key: string]: Profile } = {};
    for (const member of members) {
      options[member.id] = {
        ...member,
      };
    }
    setMemberOptions(options);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filter = (value: string, search: string) => {
    if (!value) {
      return 0;
    }
    if (value == null || !memberOptions[value]) {
      return 0;
    }
    return memberOptions[value].full_name
      .toLowerCase()
      .indexOf(search.toLowerCase()) !== -1
      ? 1
      : 0;
  };

  const onSelectedUserChange = (value: string) => {
    const foundId = Object.keys(memberOptions).find((m) => m === value);
    if (!foundId) {
      return;
    }
    setSelectedStatusId(foundId);
    updateAssignee(foundId);
  };

  async function updateAssignee(userId: string) {
    if (!userId || userId === null) {
      fetch(`/api/issues/${issueId}/assignees`, {
        method: 'DELETE',
      }).then(() => {
        setSelectedStatusId(null);
      });
    } else {
      await fetch(`/api/issues/${issueId}/assignees`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
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
            {selectedStatusId ? (
              <>
                <CircleUser className=' h-4 w-4 shrink-0 ' />
                {memberOptions &&
                  memberOptions[selectedStatusId] &&
                  memberOptions[selectedStatusId].full_name}
              </>
            ) : (
              <>
                <CircleUser className=' h-4 w-4 shrink-0' />
                <span>Unassigned</span>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0 overflow-hidden' side='right' align='start'>
          <Command filter={filter}>
            <CommandInput placeholder='Change Assignee...' />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {Object.entries(memberOptions).map(([, member]) => (
                  <CommandItem
                    key={member.id}
                    value={member.id}
                    onSelect={onSelectedUserChange}
                  >
                    <CircleUser className='mr-2 h-4 w-4 shrink-0' />
                    <span>{member.full_name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
       
           <div className='text-xs rounded-none p-1 border-t border-gray-200 font-normal w-full flex justify-center'>
          {team.title}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
