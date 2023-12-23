'use client';

import { STATUS, dateFormater, isOverdue } from '@/lib/util';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Badge } from '@radix-ui/themes';
// import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ConstructionIcon } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import TextEditor from '@/components/editor/textEditor';
import { useRouter } from 'next/navigation';
import { statusIconMapper } from '@/components/statusIconMapper';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import React from 'react';
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
import { AssigneeUpdateField } from '@/components/issues/assigneeUpdateField';
import { useToast } from '@/components/ui/use-toast';

export default function IssuePage() {
  const { toast } = useToast();
  const router = useParams();
  const { projectId, issueId } = router;
  const [issue, setIssue] = useState(undefined);
  async function fetchIssue() {
    const res = await fetch(`/api/issues/${issueId}`);
    const resultIssue = await res.json();
    setIssue(resultIssue);
  }

  async function saveContentChanges(content: string) {
    const res = await fetch(`/api/issues/${issueId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: {
          body: content,
        },
      }),
    });

    if (!res.ok) throw new Error(res.statusText);

    toast({
      title: 'Saved',
      description: 'Your changes have been saved.',
    });
  }

  useEffect(() => {
    fetchIssue();
  }, []);

  if (!issue)
    return (
      <div className='flex items-center space-x-4'>
        {/* <Skeleton className="h-12 w-12 rounded-full" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div> */}
      </div>
    );

  return (
    <div className='flex h-full w-full flex-col'>
      {/* <div className='flex h-full w-full'> */}
      <ResizablePanelGroup direction='horizontal'>
        <ResizablePanel>
          <div className=' flex h-full w-full flex-1 flex-col '>
            <div className='flex h-12 w-full items-center justify-between p-4  px-4 '>
              <div className='flex flex-row items-center gap-2'>
                <h1 className='text-md h-full pr-2 font-medium leading-tight text-gray-700'>
                  {issue.title}
                </h1>
                <ProjectOptions projectId={issue.id} />
              </div>
              <div className='flex h-full items-center justify-center gap-2'></div>
            </div>

            <div className=' flex  w-full flex-1 flex-col overflow-y-scroll '>
              <ResizablePanelGroup direction='vertical'>
                <ResizablePanel>
                  <div className=' flex h-full w-full flex-grow flex-col overflow-x-hidden overflow-y-scroll bg-gray-50'>
                    <TextEditor
                      onSave={saveContentChanges}
                      content={issue.contents.body as string}
                    />
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel
                  collapsedSize={6}
                  collapsible={true}
                  defaultSize={6}
                  minSize={6}
                >
                  <div className='flex h-full w-full flex-col items-center  gap-2 border-t border-gray-100 py-2'>
                    <div className='flex w-full flex-row items-center gap-2'>
                      <h1 className='text-md  px-4  py-2 font-medium leading-tight text-gray-700'>
                        Comments
                      </h1>
                    </div>
                    <div className='flex flex-col items-center justify-center gap-2 pb-4'>
                      <Alert>
                        <ConstructionIcon className='h-4 w-4' />
                        <AlertTitle>In progress</AlertTitle>
                        <AlertDescription>
                          This is a work in progress, please check back later.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          collapsedSize={1}
          collapsible={true}
          defaultSize={25}
          minSize={20}
        >
          <div className=' flex  w-full flex-col border-l border-gray-100 bg-white '>
            <div className='flex h-12 w-full items-center justify-between bg-white  p-4 px-4 '></div>
            <div className='flex flex-grow flex-col justify-between gap-3 divide-y divide-gray-100 border-t border-gray-100 bg-white  py-3'>
              <div className='flex  flex-col  gap-6   p-4 py-3'>
                <div className='flex h-6 flex-row items-center  gap-2'>
                  <p className='w-24 items-center  pr-2 text-xs font-medium leading-tight text-gray-700'>
                    Status
                  </p>
                  <p className='items-center  pr-2 text-xs font-medium leading-tight text-gray-700'>
                    {STATUS && (
                      <StatusField
                        status={issue.statusid}
                        projectId={projectId}
                        issueId={issue.id}
                      />
                    )}
                  </p>
                </div>
                <div className='flex h-6 flex-row items-center  gap-2'>
                  <p className='w-24 items-center  pr-2 text-xs font-medium leading-tight text-gray-700'>
                    Deadline
                  </p>
                  <p className='items-center   pr-2 text-xs font-medium leading-tight text-gray-700'>
                    {isOverdue(issue.deadline) ? (
                      <Badge color='red'>{dateFormater(issue.deadline)}</Badge>
                    ) : (
                      <Badge color='gray'>
                        {' '}
                        {dateFormater(issue.deadline)}
                      </Badge>
                    )}
                  </p>
                </div>

                <div className='flex h-6 flex-row items-center  gap-2'>
                  <p className='w-24 items-center  pr-2 text-xs font-medium leading-tight text-gray-700'>
                    Started
                  </p>
                  <p className='items-center  pr-2 text-xs font-medium leading-tight text-gray-700'>
                    <Badge color='gray'>
                      {' '}
                      {dateFormater(issue.datestarted)}
                    </Badge>
                  </p>
                </div>

                <div className='flex h-6 flex-row items-center  gap-2'>
                  <p className='w-24 items-center  pr-2 text-xs font-medium leading-tight text-gray-700'>
                    Assignee
                  </p>
                  <p className='items-center  pr-2 text-xs font-medium leading-tight text-gray-700'>
                    <AssigneeUpdateField
                      issueid={issue.id}
                      user={issue.assignees ? issue.assignees[0] : null}
                      projectid={projectId}
                    />
                  </p>
                </div>
              </div>

              <div className='flex  flex-col  gap-6   p-4 py-3'>
                <div className='flex h-6 flex-row items-center gap-2 '>
                  <p className='w-24 items-center  pr-2 text-xs font-medium leading-tight text-gray-700'>
                    Created
                  </p>
                  <p className='items-center  pr-2 text-xs font-medium leading-tight text-gray-700'>
                    {STATUS && (
                      <div className='flex flex-row items-center gap-2'>
                        {new Date(issue.datecreated).toLocaleDateString()}
                      </div>
                    )}
                  </p>
                </div>

                <div className='flex h-6 flex-row items-center gap-2'>
                  <p className='w-24 items-center  pr-2 text-xs font-medium leading-tight text-gray-700'>
                    Updated
                  </p>
                  <p className='items-center  pr-2 text-xs font-medium leading-tight text-gray-700'>
                    {STATUS && (
                      <div className='flex flex-row items-center gap-2'>
                        {new Date(issue.dateupdated).toLocaleDateString()}
                      </div>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>

        {/* </div> */}
      </ResizablePanelGroup>
    </div>
  );
}

function ProjectOptions({ projectId }: { projectId: string }) {
  const router = useRouter();

  async function deleteIssue() {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error(res.statusText);
    router.push(`/projects/${projectId}`);
  }

  async function archiveProject() {
    const res = await fetch(`/api/projects/${projectId}/archive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error(res.statusText);
    router.push('/projects');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost'>
          <DotsHorizontalIcon className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>Issue Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button variant='ghost' onClick={() => deleteIssue()}>
            Delete Issue
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function StatusField({
  status,
  projectId,
  issueId,
}: {
  status: string;
  projectId: string;
  issueId: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<any>({
    id: status,
    label: STATUS.find((m) => m.id === status)?.label || '',
  });

  async function updateStatus() {
    const res = await fetch(`/api/issues/${issueId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        statusid: selectedStatus.id,
      }),
    });

    if (!res.ok) throw new Error(res.statusText);
    // router.push(`/projects/${projectId}/issues/${issueId}`);
  }

  return (
    <div className='flex items-center space-x-4'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='ghost' className='w-full justify-start p-0'>
            <div className='flex items-center space-x-2 text-xs'>
              {statusIconMapper(status, 'h-4 w-4')}
              <span>{selectedStatus?.label}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0' side='right' align='start'>
          <Command
            filter={(value, search) => {
              return STATUS[value].label
                .toLowerCase()
                .indexOf(search.toLowerCase()) !== -1
                ? 1
                : 0;
            }}
          >
            <CommandInput placeholder='Change status...' />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {Object.keys(STATUS).map((id) => (
                  <CommandItem
                    key={id}
                    value={id}
                    onSelect={(value) => {
                      const foundId =
                        STATUS[
                          Object.keys(STATUS).find((m) => m === value) || 0
                        ];
                      setSelectedStatus({
                        ...foundId,
                      });

                      updateStatus().then(() => {
                        setOpen(false);
                      });
                    }}
                  >
                    <div className='flex items-center space-x-2'>
                      {statusIconMapper(STATUS[id].label, 'h-4 w-4')}
                      <span>{STATUS[id].label}</span>
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
