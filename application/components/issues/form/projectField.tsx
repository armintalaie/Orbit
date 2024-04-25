'use client';

import { useContext, useEffect, useState } from 'react';
import { TargetIcon } from 'lucide-react';
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

export function ProjectField({
  field,
  teamid,
}: {
  field: any;
  teamid: number;
}) {
  const { projects: projectsArray, teams } = useContext(OrbitContext);

  const [projects, setprojects] = useState<{
    [key: string]: any;
  }>({});
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(
    field ? field.value : null
  );

  useEffect(() => {
    async function fetchProjects() {
      const options: { [key: string]: any } = {};
      for (const p of projectsArray) {
        if (p.teamid !== teamid) {
          continue;
        }
        options[p.id] = {
          ...p,
        };
      }
      setprojects(options);
    }
    fetchProjects();
  }, [teamid]);
  return (
    <div className='flex items-center space-x-4 '>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='text-2xs line-clamp-1 flex h-8 w-fit justify-start overflow-hidden text-gray-800'
          >
            {selectedStatus && selectedStatus !== null ? (
              <>
                <TargetIcon className='mr-2 h-4 w-4 shrink-0 dark:text-neutral-200' />
                <span className='text-xs dark:text-neutral-200'>
                  {projects &&
                    projects[selectedStatus] &&
                    projects[selectedStatus].title}
                </span>
              </>
            ) : (
              <div className=' flex text-xs dark:text-neutral-400'>
                <TargetIcon className='mr-2 h-4 w-4 shrink-0' />
                Project
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0 ' side='bottom' align='start'>
          <Command
            className='flex flex-grow flex-col'
            filter={(value, search) => {
              if (!value) {
                return 0;
              }
              if (value.toLowerCase().includes(search.toLowerCase())) {
                return 1;
              }

              return 0;
            }}
          >
            <CommandInput placeholder='Search projects...' />

            <CommandList className=''>
              <CommandEmpty>No project found.</CommandEmpty>

              <CommandGroup>
                {Object.entries(projects).map(([key, project]) => (
                  <CommandItem
                    key={project.id}
                    value={project.id}
                    onSelect={(value) => {
                      const matchId =
                        Object.keys(projects).find((m) => m === key) || null;
                      if (
                        !matchId ||
                        !projects[matchId as string] ||
                        !projects[matchId as string].id
                      ) {
                        setSelectedStatus(null);
                        field.onChange(null);
                      } else {
                        const found = projects[matchId as string];
                        field.onChange(found.id);
                        setSelectedStatus(found.id || null);
                      }

                      setOpen(false);
                    }}
                  >
                    <TargetIcon className='mr-2 h-4 w-4 shrink-0' />

                    <span className='text-xs'>{project.title}</span>
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
