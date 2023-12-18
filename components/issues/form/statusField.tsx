'use client';

import { useState } from 'react';
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
import { STATUS } from '@/lib/util';
import { statusIconMapper } from '@/components/statusIconMapper';

export function StatusField(field: any) {
  const [open, setOpen] = useState(false);
  const statuses = STATUS || [];
  console.log(statuses);
  console.log(field.value, typeof field.value);
  const [selectedStatus, setSelectedStatus] = useState<any>(
    statuses.find((status) => status.id === field.value)
  );

  return (
    <div className='flex items-center space-x-4'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='flex w-[250px] items-center justify-start gap-2 text-xs '
          >
            {selectedStatus ? (
              <>
                {statusIconMapper(selectedStatus.label, 'h-4 w-4')}
                {selectedStatus.label}
              </>
            ) : (
              <>+ Set status</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0' side='right' align='start'>
          <Command>
            <CommandInput placeholder='Change status...' />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {statuses.map((status) => (
                  <CommandItem
                    key={status.id}
                    value={status.id.toString()}
                    onSelect={(value) => {
                      setSelectedStatus(
                        statuses.find(
                          (priority) =>
                            priority.id.toString() === value.toString()
                        ) || null
                      );
                      field.onChange(Number(value));
                      setOpen(false);
                    }}
                  >
                    <div className='flex items-center gap-2'>
                      {statusIconMapper(status.label, 'h-4 w-4')}
                      <span>{status.label}</span>
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
