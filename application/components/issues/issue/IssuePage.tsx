import { InfoCircledIcon } from '@radix-ui/react-icons';
import { useContext, useEffect, useState } from 'react';
import { MessageCircleIcon, TextSelectIcon } from 'lucide-react';
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
import IssueTitleField from './fields/issueTitleField';
import { OrbitContext } from '@/lib/context/OrbitContext';
import Head from 'next/head';
import { setDocumentMeta } from '@/lib/util';
import { useOrbitSync } from '@/lib/hooks/useOrbitSync';

export default function IssuePage({ issueId }: { issueId: number }) {
  const [issue, setIssue] = useState<IIssue | null | undefined>(undefined);
  const { width } = useWindowSize();
  const { fetcher } = useContext(OrbitContext);
  const [issueContents, setIssueContents] = useState<string | undefined>();

  const { lastMessage } = useOrbitSync({
    channels: [`issue:${issueId}`],
  });

  const fetchIssue = async () => {
    const res = await fetcher(`/api/issues/${issueId}`);

    if (res.status === 404) {
      setIssue(null);
      return;
    }
    const resultIssue = await res.json();
    if (!resultIssue) {
      return;
    }
    setDocumentMeta(`Issue ${issueId} - ${resultIssue.title}`);
    setIssue(resultIssue);
  };

  const fetchIssueContents = async () => {
    const res = await fetcher(`/api/issues/${issueId}/contents`);
    if (res.status === 404) {
      return;
    }
    const resultIssue = await res.json();
    if (!resultIssue) {
      return;
    }
    setIssueContents(resultIssue.contents);
  };

  async function saveContentChanges(content: string) {
    const res = await fetcher(`/api/issues/${issueId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: content,
      }),
    });

    if (!res.ok) throw new Error(res.statusText);
    toast('Content saved');
  }

  useEffect(() => {
    fetchIssueContents();
  }, []);

  useEffect(() => {
    fetchIssue();
  }, []);

  useEffect(() => {
    if (lastMessage) {
      const issue = JSON.parse(lastMessage) as IIssue;
      setIssue(issue);
    }
  }, [lastMessage]);

  if (issue === undefined)
    return <div className='flex items-center space-x-4'></div>;

  if (issue === null) {
    return <IssueNotFound />;
  }

  if (width < 820) {
    return (
      <div className='flex h-full w-full flex-col'>
        <div className=' flex  w-full flex-1 flex-col overflow-hidden dark:bg-neutral-900'>
          <div className='flex h-12 w-full items-center justify-between p-1 px-4  dark:bg-neutral-900   '>
            <IssueTitleField
              issueId={issueId}
              issueTitle={issue.title}
              projectId={issue.projectid}
            />
          </div>

          <div className=' flex  w-full flex-1 flex-col overflow-hidden '>
            <div className=' flex  w-full flex-1 flex-grow flex-col justify-start overflow-hidden bg-gray-50 dark:bg-neutral-900'>
              <TextEditor
                onSave={saveContentChanges}
                content={issueContents}
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
    <>
      <Head>
        <title>
          Issue {issueId} - {issue.title}
        </title>
      </Head>
      <div className='flex h-full w-full flex-col'>
        <ResizablePanelGroup direction='horizontal'>
          <ResizablePanel minSize={30} collapsedSize={1} collapsible={true}>
            <div className=' flex h-full w-full flex-1 flex-col '>
              <div className='flex h-12 w-full items-center justify-between p-1  px-4 '>
                <IssueTitleField
                  issueId={issueId}
                  issueTitle={issue.title}
                  projectId={issue.projectid}
                />

                <div className='flex h-full items-center justify-center gap-2'></div>
              </div>

              <div className=' flex  w-full flex-1 flex-col overflow-y-scroll '>
                <ResizablePanelGroup direction='vertical'>
                  <ResizablePanel>
                    <div className=' flex h-full w-full flex-grow flex-col overflow-x-hidden overflow-y-scroll bg-gray-50'>
                      <TextEditor
                        onSave={saveContentChanges}
                        content={issueContents}
                        issue={issue}
                      />
                    </div>
                  </ResizablePanel>
                  <ResizableHandle withHandle={false} />
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
          <ResizablePanel
            collapsedSize={1}
            collapsible={true}
            defaultSize={25}
            minSize={25}
          >
            <IssueInfo issueId={issue.id} refIssue={issue} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
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

function IssueNotFound() {
  return (
    <div className='flex w-full flex-grow flex-col items-center justify-center gap-4 space-x-4'>
      <TextSelectIcon className='h-24 w-24 text-gray-500' />
      <h1 className='text-4xl font-medium text-gray-500'>Issue not found</h1>
    </div>
  );
}
