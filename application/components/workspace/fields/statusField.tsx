'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CircleSlashIcon } from 'lucide-react';
import { ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form';

export function StatusField<T extends FieldValues, K extends FieldPath<T>>({
  field,
  placeholder = 'select a status',
  statusOptions,
}: {
  field: ControllerRenderProps<T, K>;
  placeholder: string;
  statusOptions: { id: string | number; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const statuses = statusOptions;
  console.log(field.value);

  return (
    <div className='m-0 flex w-full  items-center'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant={'ghost'} className=' margin-0 h-8 w-full justify-start text-left  text-2xs font-normal '>
            <div className='flex items-center  gap-2 '>
              {field.value ? (
                <>
                  <CircleSlashIcon className='h-3 w-3' />
                  <span>{statuses.find((status) => status.id === field.value)?.name}</span>
                </>
              ) : (
                <>
                  <CircleSlashIcon className='h-3 w-3' />
                  <span>{placeholder}</span>
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
                {statuses.map((status) => (
                  <CommandItem
                    key={status.id}
                    value={status.id.toString()}
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
