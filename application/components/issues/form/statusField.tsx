'use client';

import { useContext, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CircleSlashIcon } from 'lucide-react';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import useSWR from 'swr';
import Spinner from '@/components/general/Spinner';
import { ProjectStatus } from '@/lib/types';
import { ControllerRenderProps } from 'react-hook-form';

export function StatusField(field: ControllerRenderProps) {
  const [open, setOpen] = useState(false);
  const { statuses, isLoading } = useProjectStatuses();

  return (
    <div className='flex w-full items-center space-x-4 '>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='outline' size='sm' className='flex h-8 w-full items-center justify-start gap-1 text-2xs'>
            <div className='flex items-center  gap-2 text-xs'>
              {field.value ? (
                <>{field.value}</>
              ) : (
                <>
                  <CircleSlashIcon className='h-4 w-4' />
                  status
                </>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0' side='bottom' align='start'>
          <Command className='text-sm'>
            <CommandInput className='text-xs' placeholder='Change status...' />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {isLoading && <Spinner />}
                {!isLoading &&
                  statuses.map((status) => (
                    <CommandItem
                      key={status.id}
                      value={status.id}
                      onSelect={(value) => {
                        field.onChange(value);
                        setOpen(false);
                      }}
                    >
                      <div className='flex items-center gap-2 text-xs'>
                        <span>{status.name}</span>
                      </div>
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

function useProjectStatuses() {
  const { currentWorkspace } = useContext(OrbitContext);
  const { data, isLoading, error } = useSWR(
    `/api/v2/workspaces/${currentWorkspace?.id}/resources/projects/status`,
    (url) => fetch(url).then((res) => res.json())
  );

  return {
    statuses: data as ProjectStatus[],
    isLoading,
    error,
  };
}
