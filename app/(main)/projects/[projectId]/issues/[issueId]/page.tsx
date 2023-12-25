'use client';

import { STATUS, dateFormater, isOverdue } from '@/lib/util';
import { DotsHorizontalIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { Badge } from '@radix-ui/themes';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Clipboard,
  ConstructionIcon,
  FigmaIcon,
  GitBranchIcon,
  GithubIcon,
  HistoryIcon,
  Link2,
  MessageCircleIcon,
  YoutubeIcon,
} from 'lucide-react';
import Link from 'next/link';
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
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { useWindowSize } from 'usehooks-ts';

export default function IssuePage() {
  const { toast } = useToast();
  const params = useParams();
  const [pathname, setPathname] = useState('');
  const { projectId, issueId } = params;
  const [issue, setIssue] = useState(undefined);
  const { width } = useWindowSize();

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
    setPathname(window.location.href);
    fetchIssue();
  }, []);

  if (!issue) return <div className='flex items-center space-x-4'></div>;
  if (width < 820) {
    return (
      <div className='flex h-full w-full flex-col'>
        <div className=' flex  w-full flex-1 flex-col overflow-hidden '>
          <div className='flex h-12 w-full items-center justify-between p-4  px-4 '>
            <div className='flex flex-row items-center gap-2'>
              <h1 className='text-md pr-2 font-medium leading-tight text-gray-700'>
                {issue.title}
              </h1>
              <ProjectOptions projectId={issue.id} />
            </div>
            <div className='flex h-full items-center justify-center gap-2'></div>
          </div>

          <div className=' flex  w-full flex-1 flex-col overflow-hidden '>
            <div className=' flex  w-full flex-1 flex-grow flex-col justify-start overflow-hidden bg-gray-50'>
              <TextEditor
                onSave={saveContentChanges}
                content={issue.contents.body as string}
              />
            </div>
          </div>
        </div>

        <div className='fixed bottom-1 flex w-full items-center justify-end gap-4  p-4 px-4'>
          <CommentsMobilePopver
            issue={issue}
            pathname={pathname}
            projectId={projectId}
          />
          <IssueInfoMobilePopver
            issue={issue}
            pathname={pathname}
            projectId={projectId}
          />
        </div>
      </div>
    );
  }

  return (
    <div className='flex h-full w-full flex-col'>
      <ResizablePanelGroup direction='horizontal'>
        <ResizablePanel minSize={30} collapsedSize={1} collapsible={true}>
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
          <IssueInfo issue={issue} projectId={projectId} pathname={pathname} />
        </ResizablePanel>
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
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = React.useState<any>({
    id: status,
    label: STATUS.find((m) => m.id === status)?.label || '',
  });

  async function updateStatus(id: string) {
    const res = await fetch(`/api/issues/${issueId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        statusid: id,
      }),
    });

    if (!res.ok) throw new Error(res.statusText);

    toast({
      title: 'Saved',
      description: 'Status updated',
    });
  }

  return (
    <div className='flex items-center space-x-4'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='ghost' className='w-full justify-start p-0'>
            <div className='flex items-center space-x-2 text-xs'>
              {statusIconMapper(selectedStatus.label, 'h-4 w-4')}
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

                      updateStatus(foundId.id).then(() => {
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

function IssueInfoMobilePopver({
  issue,
  projectId,
  pathname,
}: {
  issue: any;
  projectId: string;
  pathname: string;
}) {
  // open={open} onOpenChange={setOpen}
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant='outline'
          className='m-0 flex h-8 items-center bg-neutral-700 p-2 text-xs text-neutral-50'
        >
          <InfoCircledIcon className='h-6 w-6 px-1 text-neutral-50' />
        </Button>
      </DrawerTrigger>
      <DrawerContent className='max-h-[90%] p-0 '>
        <div className='flex h-full w-full overflow-scroll'>
          <IssueInfo issue={issue} projectId={projectId} pathname={pathname} />
        </div>
        <DrawerFooter className='pt-2'>
          <DrawerClose asChild>
            <Button variant='outline'>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function CommentsMobilePopver({
  issue,
  projectId,
  pathname,
}: {
  issue: any;
  projectId: string;
  pathname: string;
}) {
  // open={open} onOpenChange={setOpen}
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant='outline'
          className='m-0 flex h-8 items-center bg-neutral-700 p-2 text-xs text-neutral-50'
        >
          <MessageCircleIcon className='h-6 w-6 pr-2 text-neutral-50' />
          Comments
        </Button>
      </DrawerTrigger>
      <DrawerContent className='max-h-[90%] p-0 '>
        <div className='flex h-full w-full overflow-scroll'>
          <IssueInfo issue={issue} projectId={projectId} pathname={pathname} />
        </div>
        <DrawerFooter className='pt-2'>
          <DrawerClose asChild>
            <Button variant='outline'>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function IssueInfo({
  issue,
  projectId,
  pathname,
}: {
  issue: any;
  projectId: string;
  pathname: string;
}) {
  const { toast } = useToast();

  function PlatformIconMapper(platform: string) {
    switch (platform) {
      case 'github.com':
        return <GithubIcon className='h-4 w-4' />;
      case 'figma.com':
        return <FigmaIcon className='h-4 w-4' />;
      case 'youtube.com':
        return <YoutubeIcon className='h-4 w-4' />;
      default:
        return <Link2 className='h-4 w-4' />;
    }
  }

  return (
    <div className=' flex  w-full flex-col border-l border-gray-100 bg-white '>
      <div className='flex h-12 w-full items-center justify-end gap-6  bg-white  p-4 px-4 '>
        <Button
          variant='ghost'
          disabled={true}
          className='p-0 hover:bg-inherit'
        >
          <HistoryIcon className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          className='p-0 hover:bg-inherit'
          onClick={() => {
            navigator.clipboard.writeText(`P${projectId}-issue${issue.id}`);
            toast({
              title: 'Copied',
              description: 'Issue branch Copied to clipboard.',
            });
          }}
        >
          <GitBranchIcon className='h-4 w-4' />
        </Button>
        <Button
          className='p-0 hover:bg-inherit'
          variant='ghost'
          onClick={() => {
            navigator.clipboard.writeText(`${pathname}`);
            toast({
              title: 'Copied',
              description: 'Issue link Copied to clipboard.',
            });
          }}
        >
          <Clipboard className='h-4 w-4' />
        </Button>
      </div>
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
                <Badge color='gray'> {dateFormater(issue.deadline)}</Badge>
              )}
            </p>
          </div>

          <div className='flex h-6 flex-row items-center  gap-2'>
            <p className='w-24 items-center  pr-2 text-xs font-medium leading-tight text-gray-700'>
              Assigned
            </p>
            <p className='items-center  pr-2 text-xs font-medium leading-tight text-gray-700'>
              <Badge color='gray'> {dateFormater(issue.datestarted)}</Badge>
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

        <div className='flex  flex-col  gap-3   p-4 py-3'>
          <h3 className='text-md  py-2 font-medium leading-tight text-gray-700'>
            Links
          </h3>
          {issue.contents.links &&
            issue.contents.links.map((link) => (
              <Link
                href={link.link}
                className='flex h-10 flex-row items-center gap-2 rounded-lg border border-gray-200 py-0  '
              >
                <p className='flex h-full  w-fit items-center justify-center border-r border-gray-200 px-3  text-xs font-medium leading-tight text-gray-700'>
                  {PlatformIconMapper(link.domain)}
                </p>
                <p className='items-center  p-2 text-2xs font-medium leading-tight text-gray-700'>
                  {link.name}
                </p>
              </Link>
            ))}
          <button className='flex h-10 flex-row items-center gap-2 rounded-lg border border-dashed border-gray-200  py-0  '>
            <p className='flex h-full  w-fit items-center justify-center border-r border-dashed border-gray-200  px-3 text-xs font-medium leading-tight text-gray-700'>
              {PlatformIconMapper('link')}
            </p>
            <p className='items-center  p-2 text-xs font-medium leading-tight text-gray-600'>
              Add Link
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
