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

export function ProjectField({ field }: { field: any }) {
  const { projects: projectsArray } = useContext(OrbitContext);

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
        options[p.id] = {
          ...p,
        };
      }
      setprojects(options);
    }
    fetchProjects();
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
            {selectedStatus && selectedStatus !== null ? (
              <>
                <TargetIcon className='mr-2 h-4 w-4 shrink-0' />
                {projects &&
                  projects[selectedStatus] &&
                  projects[selectedStatus].title}
              </>
            ) : (
              <div className=' flex text-xs '>
                <TargetIcon className='mr-2 h-4 w-4 shrink-0' />
                Project
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0 ' side='bottom' align='start'>
          <Command
            className='flex flex-grow flex-col overflow-hidden bg-red-200 '
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
            <CommandInput placeholder='Select project...' />
            <CommandList className='h-40 overflow-y-scroll'>
              <CommandEmpty>No project found.</CommandEmpty>
              {/* <CommandGroup className='overflow-y-scroll flex flex-col flex-grow h-40'> */}
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

                  <span>{project.title}</span>
                </CommandItem>
              ))}
              {/* </CommandGroup> */}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
