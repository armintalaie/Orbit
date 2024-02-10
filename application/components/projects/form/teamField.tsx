'use client';

import { useContext, useEffect, useState } from 'react';
import { Users2Icon } from 'lucide-react';
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
import { OrbitContext } from '@/lib/context/OrbitContext';

export function TeamField({ field }: { field: any }) {
  const { teams: teamArray } = useContext(OrbitContext);
  const userSession = useContext(UserSessionContext);
  const [teams, setTeams] = useState<{
    [key: string]: any;
  }>({});
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(
    field ? field.value : null
  );

  useEffect(() => {
    async function fetchTeams() {
      const options: { [key: string]: any } = {};
      for (const p of teamArray) {
        options[p.id] = {
          ...p,
        };
      }
      setTeams(options);
    }
    fetchTeams();
  }, [teamArray]);
  return (
    <div className='flex items-center space-x-4'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='line-clamp-1 flex h-8 w-fit justify-start overflow-hidden text-2xs text-gray-800'
          >
            {selectedStatus && selectedStatus !== null ? (
              <>
                {teams && teams[selectedStatus] && teams[selectedStatus].name}
              </>
            ) : (
              <div className=' flex text-xs '>
                <Users2Icon className='mr-2 h-4 w-4 shrink-0' />
                Teams
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
              if (!teams[value]) return 0;

              return teams[value].name
                .toLowerCase()
                .indexOf(search.toLowerCase()) !== -1
                ? 1
                : 0;
            }}
          >
            <CommandInput placeholder='Select team...' />
            <CommandList>
              <CommandEmpty>No member found.</CommandEmpty>
              <CommandGroup>
                {Object.entries(teams).map(([key, team]) => (
                  <CommandItem
                    key={team.id}
                    value={teams.id}
                    onSelect={(value) => {
                      const matchId =
                        Object.keys(teams).find((m) => m === key) || null;
                      if (
                        !matchId ||
                        !teams[matchId as string] ||
                        !teams[matchId as string].id
                      ) {
                        setSelectedStatus(null);
                        field.onChange(null);
                      } else {
                        const found = teams[matchId as string];
                        field.onChange(found.id);
                        setSelectedStatus(found.id || null);
                      }

                      setOpen(false);
                    }}
                  >
                    <span>{team.name}</span>
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
