'use client';

import * as React from 'react';
import {
  ArrowLeftCircle,
  CalendarIcon,
  CircleSlashIcon,
  FolderIcon,
  TagIcon,
  UserCircle,
  Users2Icon,
  XIcon,
} from 'lucide-react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { PlusCircleIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { STATUS } from '@/lib/util';
import { statusIconMapper } from '../statusIconMapper';
import { UserFilter } from '../userFilter';

type FilterType =
  | 'status'
  | 'assignee'
  | 'priority'
  | 'deadline'
  | 'labels'
  | 'more';

export default function FilterGroup({
  filters,
  setFilters,
}: {
  filters: any[];
  setFilters: any;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [filterType, setFilterType] = React.useState<FilterType | undefined>(
    undefined
  );

  function addFilter({
    key,
    value,
    type,
    relation,
  }: {
    key: string;
    value: string;
    type: FilterType;
    relation?: string;
  }) {
    setFilters([...filters, { key, value, type, relation }]);
  }

  const filterGroups = {
    status: {
      name: 'status',
      icon: <CircleSlashIcon className='h-4 w-4' />,
      command: (
        <StatusFilter
          backBtn={() => {
            setFilterType(undefined);
          }}
          addFilter={addFilter}
        />
      ),
    },
    assignee: {
      name: 'assignee',
      icon: <UserCircle className='h-4 w-4' />,
      command: (
        <UserFilter
          teamid={1}
          backBtn={() => {
            setFilterType(undefined);
          }}
        />
      ),
    },
    deadline: {
      name: 'deadline',
      icon: <CalendarIcon className='h-4 w-4' />,
      command: <div>deadline</div>,
    },
    labels: {
      name: 'labels',
      icon: <TagIcon className='h-4 w-4' />,
      command: <div>labels</div>,
    },
    project: {
      name: 'project',
      icon: <FolderIcon className='h-4 w-4' />,
      command: <div>project</div>,
    },
    team: {
      name: 'team',
      icon: <Users2Icon className='h-4 w-4' />,
      command: <div>team</div>,
    },
  };

  return (
    <div className='flex flex-row items-center gap-2'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className='m-0 flex h-6 items-center gap-2 border-dashed p-2 text-xs'
            role='combobox'
            aria-expanded={open}
          >
            Filter
            <PlusCircleIcon className=' h-3 w-3' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[200px] p-0'>
          {!filterType && (
            <Command>
              <CommandInput placeholder='Search filters...' />
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {Object.entries(filterGroups).map(([key, fl]) => (
                  <CommandItem
                    key={fl.name}
                    value={fl.name}
                    onSelect={(currentValue) => {
                      // setValue(currentValue === value ? "" : currentValue)
                      setFilterType(
                        currentValue === value
                          ? undefined
                          : (currentValue as FilterType)
                      );
                    }}
                  >
                    <div className='flex items-center gap-2'>
                      {fl.icon}
                      <span>{fl.name}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          )}

          {filterType && filterGroups[filterType].command}
        </PopoverContent>
      </Popover>
      {filters.map((fl) => (
        <Button
          variant='outline'
          className='m-0 flex h-6 items-center gap-2 border-dashed p-2 text-xs'
          role='combobox'
          aria-expanded={open}
          onClick={() => {
            setFilters(filters.filter((f) => f.key !== fl.key));
          }}
        >
          {filterGroups[fl.type].icon}
          <span>{fl.value}</span>
          <XIcon className='h-3 w-3 text-gray-600' />
        </Button>
      ))}
    </div>
  );
}

function StatusFilter({ backBtn, addFilter }: { backBtn: () => void }) {
  const [value, setValue] = React.useState('');
  const status = STATUS || [];

  return (
    <Command>
      <div className='flex h-full items-center gap-2'>
        <CommandInput placeholder='Search...' className='w-full border-none' />
      </div>

      <CommandEmpty>No status</CommandEmpty>
      <CommandGroup>
        {status.map((st) => (
          <CommandItem
            key={st.id}
            value={st.label}
            onSelect={(currentValue) => {
              addFilter({ key: st.id, value: st.label, type: 'status' });
              // setOpen(false)
            }}
          >
            <div className='flex items-center gap-2'>
              {statusIconMapper(st.label, 'h-4 w-4')}
              <span>{st.label}</span>
            </div>
          </CommandItem>
        ))}

        <Button
          variant='ghost'
          onClick={backBtn}
          className='h-full w-full rounded-none rounded-b-lg border-t border-t-gray-100 p-2 '
        >
          <ArrowLeftCircle className='h-4 w-4' />
        </Button>
      </CommandGroup>
    </Command>
  );
}
