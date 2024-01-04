'use client';

import * as React from 'react';
import {
  ArrowLeftCircle,
  BoxIcon,
  CalendarIcon,
  CircleSlashIcon,
  ListFilterIcon,
  TagIcon,
  TargetIcon,
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
import { Button } from '../ui/button';
import { statusIconMapper } from '../statusIconMapper';
import { UserFilter } from '../userFilter';
import IssueLabel from './label';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { OrbitContext } from '@/lib/context/OrbitContext';

type FilterType =
  | 'status'
  | 'assignee'
  | 'priority'
  | 'deadline'
  | 'project'
  | 'labels'
  | 'more';

export default function FilterGroup({
  filters,
  setFilters,
  filterMethod,
  setFilterMethod,
}: {
  filters: any[];
  setFilters: any;
  filterMethod: string;
  setFilterMethod: any;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [filterType, setFilterType] = React.useState<FilterType | undefined>(
    undefined
  );

  function setOpenChanged() {
    setOpen(!open);
    setFilterType(undefined);
  }

  function addFilter({
    key,
    value,
    type,
    relation,
    content,
  }: {
    key: string;
    value: string;
    type: FilterType;
    relation?: string;
    content?: any;
  }) {
    setFilters([...filters, { key, value, type, relation, content }]);
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
      command: (
        <LabelFilter
          backBtn={() => {
            setFilterType(undefined);
          }}
          addFilter={addFilter}
        />
      ),
    },
    project: {
      name: 'project',
      icon: <TargetIcon className='h-4 w-4' />,
      command: (
        <ProjectFilter
          backBtn={() => {
            setFilterType(undefined);
          }}
          addFilter={addFilter}
        />
      ),
    },
    team: {
      name: 'team',
      icon: <Users2Icon className='h-4 w-4' />,
      command: <div>team</div>,
    },
  };

  function AppliedProjectFilter(pr) {
    return (
      <Button
        variant='outline'
        className='m-0 flex h-6 items-center gap-2 border-dashed p-2 pl-1 text-xs'
        role='combobox'
        style={{ borderColor: `${pr.content.color}` }}
        aria-expanded={open}
        onClick={() => {
          setFilters(
            filters.filter((f) => f.key !== pr.key && f.type !== 'project')
          );
        }}
      >
        <BoxIcon className='h-4 w-4' />
        <span className='text-xs'>{pr.value}</span>
        <XIcon className='h-3 w-3 text-gray-600' />
      </Button>
    );
  }

  function AppliedLabelFilter(fl) {
    return (
      <Button
        variant='outline'
        className='m-0 flex h-6 items-center gap-2 border-dashed p-2 pl-1 text-xs'
        role='combobox'
        style={{ borderColor: `${fl.content.color}` }}
        aria-expanded={open}
        onClick={() => {
          setFilters(filters.filter((f) => f.key !== fl.key));
        }}
      >
        <IssueLabel
          label={fl.value}
          id={fl.key}
          color={fl.content.color}
          compact={true}
        />
        <span className='text-xs'>{fl.value}</span>
        <XIcon className='h-3 w-3 text-gray-600' />
      </Button>
    );
  }

  return (
    <div className='flex flex-row flex-wrap items-center gap-2'>
      <Popover open={open} onOpenChange={setOpenChanged}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className='m-0 flex h-6 items-center gap-2 border-dashed p-2 text-xs'
            role='combobox'
            aria-expanded={open}
          >
            <ListFilterIcon className=' h-3 w-3' />
            Filter
          </Button>
        </PopoverTrigger>
        {filters.length > 1 && (
          <ToggleGroup
            type='single'
            value={filterMethod}
            onValueChange={setFilterMethod}
            className='m-0 flex h-6 items-center rounded-md border border-dashed border-gray-200 p-[1px] text-xs'
          >
            <ToggleGroupItem
              className='m-0 flex h-full w-8 items-center gap-2 border-dashed p-1 text-2xs  data-[state=on]:bg-neutral-700 '
              value='ALL'
            >
              All
            </ToggleGroupItem>
            <ToggleGroupItem
              className='m-0 flex   h-full w-8 items-center gap-2 border-dashed p-1 text-2xs  data-[state=on]:bg-neutral-700'
              value='ANY'
            >
              Any
            </ToggleGroupItem>
          </ToggleGroup>
        )}
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

      {filters.map((fl) =>
        fl.type === 'label' ? (
          AppliedLabelFilter(fl)
        ) : (
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
        )
      )}
      {filters.length > 2 && (
        <Button
          variant='outline'
          className='m-0 flex h-6 items-center gap-2 border-dashed p-2 text-xs'
          role='combobox'
          aria-expanded={open}
          onClick={() => {
            setFilters([]);
          }}
        >
          Remove all
          <XIcon className=' h-3 w-3' />
        </Button>
      )}
    </div>
  );
}

function StatusFilter({ backBtn, addFilter }: { backBtn: () => void }) {
  const { status } = React.useContext(OrbitContext);

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

function LabelFilter({ backBtn, addFilter }: { backBtn: () => void }) {
  const { labels } = React.useContext(OrbitContext);

  return (
    <Command>
      <div className='flex h-full items-center gap-2'>
        <CommandInput placeholder='Search...' className='w-full border-none' />
      </div>

      <CommandEmpty>No labels</CommandEmpty>
      <CommandGroup>
        {labels.map((label) => (
          <CommandItem
            className='flex w-full items-center gap-2'
            key={label.id}
            value={label.id}
            onSelect={(currentValue) => {
              addFilter({
                key: label.id,
                value: label.label,
                type: 'label',
                content: label,
              });
              // setOpen(false)
            }}
          >
            <div className='flex w-full items-center gap-2'>
              <IssueLabel
                label={label.label}
                id={label.id}
                color={label.color}
                compact={false}
              />
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

function ProjectFilter({ backBtn, addFilter }: { backBtn: () => void }) {
  const { projects } = React.useContext(OrbitContext);

  if (!projects) {
    return <div>loading</div>;
  }

  return (
    <Command>
      <div className='flex h-full items-center gap-2'>
        <CommandInput placeholder='Search...' className='w-full border-none' />
      </div>

      <CommandEmpty>No labels</CommandEmpty>
      <CommandGroup>
        {projects.map((project) => (
          <CommandItem
            className='flex w-full items-center gap-2'
            key={project.id}
            value={project.id}
            onSelect={(currentValue) => {
              addFilter({
                key: project.id,
                value: project.title,
                type: 'project',
                content: project,
              });
            }}
          >
            <div className='flex items-center gap-2 text-xs'>
              <TargetIcon className='h-4 w-4 ' />
              <span>{project.title}</span>
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
