'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TargetIcon } from 'lucide-react';
import { ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form';

export function ProjectField<T extends FieldValues, K extends FieldPath<T>>({
  field,
  placeholder = 'select a status',
  projectOptions,
}: {
  field: ControllerRenderProps<T, K>;
  placeholder: string;
  projectOptions: { id: string | number; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const projects = projectOptions;

  return (
    <div className='m-0 flex w-full  items-center'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant={'ghost'} className=' margin-0 text-2xs h-8 w-full justify-start  text-left font-normal '>
            <div className='flex items-center  gap-2 '>
              {field.value ? (
                <>
                  <TargetIcon className='h-3 w-3' />
                  <span>{projects.find((proj) => proj.id === field.value)?.name}</span>
                </>
              ) : (
                <>
                  <TargetIcon className='h-3 w-3' />
                  <span>{placeholder}</span>
                </>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0' side='bottom' align='start'>
          <Command className='text-sm'>
            <CommandInput className='text-xs' placeholder='Select Project...' />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {projects.map((proj) => (
                  <CommandItem
                    key={proj.id}
                    value={proj.id.toString()}
                    onSelect={(value) => {
                      field.onChange(value);
                      setOpen(false);
                    }}
                  >
                    <div className='flex items-center gap-2 text-xs'>
                      <span>{proj.name}</span>
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
