'use client';

import { useState, useEffect, useContext } from 'react';
import { PencilLine, TargetIcon } from 'lucide-react';
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
import Link from 'next/link';
import { UserSessionContext } from '@/lib/context/AuthProvider';
import { OrbitContext } from '@/lib/context/OrbitContext';

type IssueProjectFieldProps = {
  contentOnly?: boolean;
  issueId: number;
  project: Project | null;
};

type Project = {
  id: number;
  title: string;
};

export function IssueProjectField(props: IssueProjectFieldProps) {
  const { issueId, project, contentOnly = false } = props;
  const { fetcher, projects } = useContext(OrbitContext);
  const [options, setOptions] = useState<{ [key: string]: Project }>({});
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(
    project ? project.id : null
  );
  const [selectedTitle, setSelectedTitle] = useState<string | null>(
    project ? project.title : null
  );

  const fetchProjects = async () => {
    const options: { [key: string]: Project } = {};
    for (const proj of projects) {
      options[proj.id] = {
        ...proj,
      };
    }
    setOptions(options);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    setSelectedId(project ? project.id : null);
    setSelectedTitle(project ? project.title : null);
  }, [options]);

  const filter = (value: string, search: string) => {
    if (!value) {
      return 0;
    }
    if (value == null || !options[value]) {
      return 0;
    }
    return options[value].title.toLowerCase().indexOf(search.toLowerCase()) !==
      -1
      ? 1
      : 0;
  };

  const onSelectionChange = (value: string) => {
    const foundId = Object.keys(options).find((m) => m === value);
    if (!foundId) {
      return;
    }
    setSelectedId(Number(foundId));
    updateProject(Number(foundId));
  };

  async function updateProject(pId: number) {
    if (!pId || pId === null) {
      fetcher(`/api/issues/${issueId}/assignees`, {
        method: 'DELETE',
      }).then(() => {
        setSelectedId(null);
      });
    } else {
      await fetcher(`/api/issues/${issueId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectid: pId }),
      });
    }
  }

  const issueProjectSection = (
    <Command filter={filter}>
      <CommandInput placeholder='Move to another project...' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Object.entries(options).map(([, option]) => (
            <CommandItem
              key={option.id}
              value={option.id.toString()}
              onSelect={onSelectionChange}
            >
              <TargetIcon className='mr-2 h-4 w-4 shrink-0' />
              <span>{option.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );

  if (contentOnly) {
    return issueProjectSection;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className='flex flex-grow items-center gap-2 space-x-4'>
        <PopoverTrigger className='flex w-fit items-center gap-4'>
          {selectedId && selectedTitle && (
            <Link
              href={`/projects/${selectedId}`}
              target='_blank'
              rel='noopener noreferrer'
              className='flex w-fit items-center p-0'
            >
              {selectedId ? (
                <>{selectedTitle}</>
              ) : (
                <>
                  <TargetIcon className=' h-4 w-4 shrink-0' />
                  <span>No Project</span>
                </>
              )}
            </Link>
          )}
          <Button
            variant='ghost'
            size='sm'
            className='w-fit items-center justify-start gap-2 p-0 text-xs '
          >
            <PencilLine className='h-4 w-4 shrink-0 text-gray-500' />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className='p-0' side='right' align='start'>
        {issueProjectSection}
      </PopoverContent>
    </Popover>
  );
}
