'use client';

import { useState, useEffect } from 'react';
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
import { LABELS } from '@/lib/util';
import IssueLabel from '../label';
import { TagsIcon } from 'lucide-react';

export function LabelField({ setFields }: { setFields: any }) {
  const [open, setOpen] = useState(false);
  const labels = LABELS || [];
  const [selectedLabels, setSelectedLabels] = useState<any[]>([]);

  useEffect(() => {
    setFields(selectedLabels.map((label) => label.id));
  }, [selectedLabels]);

  return (
    <div className='flex w-fit items-center space-x-4 '>
      <Popover open={open} onOpenChange={setOpen}>
        <div className='flex items-center gap-1 rounded-md border '>
          <PopoverTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              className='border-right flex h-8 w-fit items-center justify-start gap-2 rounded-md border-gray-200 text-2xs'
            >
              <TagsIcon className='h-4 w-4' />
              Labels
            </Button>
          </PopoverTrigger>

          <div className='flex h-8 items-center space-x-2 p-1'>
            {selectedLabels.map((label) => (
              <IssueLabel
                key={label.id}
                label={label.label}
                color={label.color}
                className='h-full'
                id={label.id}
              />
            ))}
          </div>
        </div>
        <PopoverContent className='p-0' side='right' align='start'>
          <Command>
            <CommandInput placeholder='Add Label...' />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {labels.map((label) => (
                  <CommandItem
                    key={label.id}
                    value={label.id.toString()}
                    onSelect={(value) => {
                      setSelectedLabels((prev) => {
                        const labelToAdd = labels.find(
                          (priority) =>
                            priority.id.toString() === value.toString()
                        );

                        if (prev.some((label) => label.id === labelToAdd.id)) {
                          return prev;
                        }

                        return [...prev, labelToAdd];
                      });
                    }}
                  >
                    <div className='flex items-center gap-2'>
                      <IssueLabel
                        label={label.label}
                        color={label.color}
                        id={label.id}
                      />
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
