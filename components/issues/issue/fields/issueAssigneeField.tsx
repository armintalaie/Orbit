'use client';

import { useState, useEffect, useContext } from 'react';
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
import { OrbitContext } from '@/lib/context/OrbitContext';
import AssigneeAvatar from '@/components/projects/AssigneeAvatar';
import { IIssue } from '@/lib/types/issue';

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  username: string;
}

type AssigneeUpdateFieldProps = {
  reload?: (issue?: IIssue) => void;
  contentOnly?: boolean;
  issueId: number;
  user: Profile | null;
  team: {
    id: number;
    title: string;
  };
};

export function IssueAssigneeField(props: AssigneeUpdateFieldProps) {
  const { issueId, user, team, contentOnly = false, reload } = props;
  const { fetcher } = useContext(OrbitContext);
  const [memberOptions, setMemberOptions] = useState<{
    [key: string]: Profile;
  }>({});
  const [open, setOpen] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState<string | null>(
    user ? user.id : null
  );

  const fetchMembers = async () => {
    const res = await fetcher(`/api/teams/${team.id}/members`, {
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

  const onSelectedUserChange = (value?: string) => {
    if (!value || value === null || value === 'unassigned') {
      updateAssignee();
      return;
    }
    const foundId = Object.keys(memberOptions).find((m) => m === value);
    if (!foundId) {
      return;
    }
    setSelectedStatusId(foundId);
    updateAssignee(foundId);
  };

  async function updateAssignee(userId?: string) {
    if (!userId || userId === null || userId === 'unassigned') {
      fetcher(`/api/issues/${issueId}/assignees`, {
        method: 'DELETE',
      }).then(() => {
        setSelectedStatusId(null);
        reload && reload();
      });
    } else {
      const res = await fetcher(`/api/issues/${issueId}/assignees`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(reload ? { 'X-Full-Object': 'true' } : {}),
        },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await res.json();
      reload && reload(data);
    }
  }

  const issueAssigneeSection = (
    <Command filter={filter}>
      <CommandInput placeholder='Change Assignee...' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          <CommandItem
            key={-1}
            value={'unassigned'}
            onSelect={onSelectedUserChange}
          >
            <CircleUser className='mr-2 h-5 w-5 shrink-0 text-gray-500' />
            <span className='text-[10px] text-gray-500'>Unassigned</span>
          </CommandItem>
          {Object.entries(memberOptions).map(([, member]) => (
            <CommandItem
              key={member.id}
              value={member.id}
              onSelect={onSelectedUserChange}
            >
              <AssigneeAvatar
                assignee={member}
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
  );

  if (contentOnly) {
    return issueAssigneeSection;
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
                {memberOptions && memberOptions[selectedStatusId] && (
                  <AssigneeAvatar assignee={memberOptions[selectedStatusId]} />
                )}
              </>
            ) : (
              <>
                <CircleUser className=' h-4 w-4 shrink-0' />
                <span>Unassigned</span>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='overflow-hidden p-0'
          side='right'
          align='start'
        >
          {issueAssigneeSection}
        </PopoverContent>
      </Popover>
    </div>
  );
}
