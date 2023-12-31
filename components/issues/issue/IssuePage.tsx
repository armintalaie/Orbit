'use client';

import { DotsHorizontalIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { MessageCircleIcon } from 'lucide-react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import TextEditor from '@/components/editor/textEditor';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { useWindowSize } from 'usehooks-ts';
import { toast } from 'sonner';
import { IIssue } from '@/lib/types/issue';
import { IssueComments } from './IssueComments';
import { IssueInfo } from './IssueInfo';
import router from 'next/router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function IssuePage({ issueId }: { issueId: number }) {
  const [issue, setIssue] = useState<IIssue | null>(null);
  const { width } = useWindowSize();

  const fetchIssue = async () => {
    const res = await fetch(`/api/issues/${issueId}`);
    const resultIssue = await res.json();
    if (!resultIssue) {
      return;
    }
    setIssue(resultIssue);
  };

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

    toast('Content saved');
  }

  useEffect(() => {
    fetchIssue();
  }, []);

  if (issue === null)
    return <div className='flex items-center space-x-4'></div>;

  if (width < 820) {
    return (
      <div className='flex h-full w-full flex-col'>
        <div className=' flex  w-full flex-1 flex-col overflow-hidden '>
          <div className='flex h-12 w-full items-center justify-between p-4  px-4 '>
            <div className='flex flex-row items-center gap-2'>
              <h1 className='text-md pr-2 font-medium leading-tight text-gray-700'>
                {issue.title}
              </h1>
              <IssueOptions issueId={issue.id} projectId={issue.projectid} />
            </div>
            <div className='flex h-full items-center justify-center gap-2'></div>
          </div>

          <div className=' flex  w-full flex-1 flex-col overflow-hidden '>
            <div className=' flex  w-full flex-1 flex-grow flex-col justify-start overflow-hidden bg-gray-50'>
              <TextEditor
                onSave={saveContentChanges}
                content={issue.contents.body as string}
                issue={issue}
              />
            </div>
          </div>
        </div>

        <div className='fixed bottom-1 flex w-full items-center justify-end gap-4  p-4 px-4'>
          <CommentsMobilePopver issueId={issueId} />
          <IssueInfoMobilePopver issue={issue} issueId={issueId} />
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
                <IssueOptions issueId={issue.id} projectId={issue.projectid} />
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
                      issue={issue}
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
                  <IssueComments issueId={issue.id} />
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
          <IssueInfo issueId={issue.id} refIssue={issue} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function IssueOptions({
  issueId,
  projectId,
}: {
  issueId: number;
  projectId: number;
}) {
  async function deleteIssue() {
    const res = await fetch(`/api/issue/${issueId}`, {
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
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
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

function IssueInfoMobilePopver({
  issueId,
  issue,
}: {
  issueId: number;
  issue: any;
}) {
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
          <IssueInfo refIssue={issue} issueId={issueId} />
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

function CommentsMobilePopver({ issueId }: { issueId: number }) {
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
          <IssueComments issueId={issueId} />
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
