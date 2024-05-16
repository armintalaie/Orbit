'use client';

import { useState, useEffect, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import IssueLabel from '../label';
import { TagsIcon } from 'lucide-react';
import { OrbitContext } from '@/lib/context/OrbitContext';

export function LabelField({ setFields }: { setFields: any }) {
  const [open, setOpen] = useState(false);
  const { labels: labelArray } = useContext(OrbitContext);
  const labels = groupLabelsAsIdObject(labelArray);
  const [selectedLabels, setSelectedLabels] = useState<any[]>([]);

  function groupLabelsAsIdObject(labels: any[]) {
    const labelsAsIdObject: any = {};
    labels.forEach((label) => {
      labelsAsIdObject[label.id] = label;
    });
    return labelsAsIdObject;
  }

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
              <IssueLabel key={label.id} label={label.label} color={label.color} className='h-full' id={label.id} />
            ))}
          </div>
        </div>
        <PopoverContent className='p-0' side='bottom' align='start'>
          <Command
            filter={(value, search) => {
              if (!value || !labels[value]) {
                return 0;
              }
              if (labels[value].label.toLowerCase() === search.toLowerCase()) {
                return 1;
              }
              return labels[value].label.toLowerCase().indexOf(search.toLowerCase()) !== -1 ? 0.5 : 0;
            }}
          >
            <CommandInput placeholder='Filter Labels...' />
            <CommandList className=''>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup className='flex max-h-40 flex-col gap-2 '>
                {Object.entries(labels).map(([key, label]) => (
                  <CommandItem
                    key={label.id}
                    value={label.id.toString()}
                    onSelect={(value) => {
                      setSelectedLabels((prev) => {
                        const labelToAdd = labels[value];

                        if (prev.some((label) => label.id === labelToAdd.id)) {
                          return prev;
                        }

                        return [...prev, labelToAdd];
                      });
                    }}
                  >
                    <div className='flex items-center gap-2'>
                      <IssueLabel label={label.label} color={label.color} id={label.id} />
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
