'use client';

import * as React from 'react';
import {
  ArrowLeftCircle,
  Calendar,
  CalendarIcon,
  Check,
  ChevronsUpDown,
  CircleDashedIcon,
  FolderIcon,
  TagIcon,
  UserCircle,
  Users2Icon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
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
import { PlusCircleIcon, TableIcon } from 'lucide-react';
import { ToggleGroup } from '../ui/toggle-group';
import { Button } from '../ui/button';
import { StatusField } from './form/statusField';
import { useState } from 'react';
import { STATUS } from '@/lib/util';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { statusIconMapper } from '../statusIconMapper';
import { UserFinder } from '../userFinder';
import { UserFilter } from '../userFilter';

export default function FilterGroup({}) {
  const [filters, setFilters] = useState([]);

  function addFilter() {
    setFilters([...filters, '']);
  }

  return (
    <div className='flex  w-full flex-row items-center justify-between  bg-white  '>
      <ComboboxDemo2 />
    </div>
  );
}

const frameworks = [
  {
    value: 'status',
    label: 'status',
    icon: <CircleDashedIcon className='h-4 w-4' />,
  },
  {
    value: 'assignee',
    label: 'assignee',
    icon: <UserCircle className='h-4 w-4' />,
  },
  {
    value: 'deadline',
    label: 'deadline',
    icon: <CalendarIcon className='h-4 w-4' />,
  },
  {
    value: 'label',
    label: 'label',
    icon: <TagIcon className='h-4 w-4' />,
  },
  {
    value: 'project',
    label: 'project',
    icon: <FolderIcon className='h-4 w-4' />,
  },
];

function StatusFilter({ backBtn }: { backBtn: () => void }) {
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
              //   setValue(currentValue === value ? "" : currentValue)
              //   setOpen(false)
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

// filter by status, assignee, priority, deadline, labels, and more

type FilterType =
  | 'status'
  | 'assignee'
  | 'priority'
  | 'deadline'
  | 'labels'
  | 'more';

function ComboboxDemo2() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [filterType, setFilterType] = React.useState<FilterType | undefined>(
    undefined
  );

  const filters = {
    status: {
      name: 'status',
      icon: <CircleDashedIcon className='h-4 w-4' />,
      command: (
        <StatusFilter
          backBtn={() => {
            setFilterType(undefined);
          }}
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
            <CommandInput placeholder='Search framework...' />
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {Object.entries(filters).map(([key, fl]) => (
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

        {filterType && filters[filterType].command}
      </PopoverContent>
    </Popover>
  );
}
