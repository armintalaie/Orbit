'use client';

import { NewIssue } from '@/components/newIssue';
import { CardHeader, CardContent } from '@/components/ui/card';
import { STATUS } from '@/lib/util';
import { Heading } from '@radix-ui/themes';
import { statusIconMapper } from '@/components/statusIconMapper';
import IssueCard from './IssueCard';
import { BoxSelectIcon, ReplaceIcon, Trash2Icon } from 'lucide-react';
import { useContext, useEffect } from 'react';
import { ShortcutKeyboardContext } from '@/lib/context/ShortcutKeyboardProvider';
import { Button } from '../ui/button';

export interface KanbanViewProps {
  issues: {
    id: number;
    title: string;
    deadline: string;
    priority: number;
    projectid?: number;
    statusid: number;
  }[];
  reload: () => void;
  projectId?: number;
}

type Issue = {
  id: number;
  title: string;
  deadline: string;
  priority: number;
  projectid: number | null;
  statusid: number;
};

export default function KanbanView({
  issues,
  reload,
  projectId,
}: KanbanViewProps) {
  const status: { id: number; label: string }[] = STATUS || [];
  const groupedTasks = groupByStatus(issues);
  let emptyStatus = getEmptyStatus();
  const keyboardEvent = useContext(ShortcutKeyboardContext);

  function groupByStatus(issues: Issue[]) {
    return issues.reduce<{ [key: number]: { issues: Issue[] } }>(
      (acc, task) => {
        if (!acc[task.statusid]) {
          acc[task.statusid] = { issues: [] };
        }
        acc[task.statusid].issues.push(task);
        return acc;
      },
      {}
    );
  }

  function getEmptyStatus() {
    const emptyStatus = [];
    for (const status of STATUS) {
      if (!groupedTasks[status.id]) {
        emptyStatus.push(status);
      }
    }
    return emptyStatus;
  }

  useEffect(() => {
    emptyStatus = getEmptyStatus();
  }, [issues]);

  return (
    <div className='flex h-full w-full flex-1 flex-row gap-12  overflow-scroll  p-2 py-0'>
      <div className='flex flex-grow gap-4 '>
        {status.map((status) =>
          groupedTasks[status.id] &&
          groupedTasks[status.id].issues.length > 0 ? (
            <div key={status.id} className='flex flex-col'>
              <div key={status.id} className='h-full w-72 rounded-sm p-0 '>
                <CardHeader className='m-0 flex flex-row items-center justify-between space-y-0 px-1'>
                  <div className='m-0 flex flex-row items-center gap-2'>
                    {statusIconMapper(status.label, 'h-4 w-4')}
                    <Heading
                      size='1'
                      className='flex items-center text-gray-700'
                    >
                      {status.label}
                    </Heading>
                  </div>

                  <NewIssue
                    button={false}
                    projectid={projectId}
                    reload={reload}
                  />
                </CardHeader>
                <CardContent className='flex-1 overflow-y-auto p-0'>
                  <ul className='space-y-3'>
                    {groupedTasks[status.id] &&
                      groupedTasks[status.id].issues.map((issue) => (
                        <div key={issue.id}>
                          <IssueCard issue={issue} reload={reload} />
                        </div>
                      ))}
                  </ul>
                </CardContent>
              </div>
            </div>
          ) : (
            <></>
          )
        )}
      </div>

      {keyboardEvent === 'k' && (
        <div className='fixed bottom-0 left-1/2 z-30 flex flex-grow -translate-x-1/2 -translate-y-1/2 gap-4 rounded-md bg-neutral-700 text-white shadow-md '>
          <Button
            className='flex flex-row items-center gap-2  rounded-sm p-2 px-4'
            variant='ghost'
          >
            <ReplaceIcon className='h-4 w-4' />
            <p className=''>Move</p>
          </Button>

          <Button
            className='flex flex-row items-center gap-2  rounded-sm p-2 px-4'
            variant='ghost'
          >
            <Trash2Icon className='h-4 w-4' />
            <p className=''>Delete</p>
          </Button>
        </div>
      )}

      <div className='flex flex-col py-5'>
        <div className='h-full w-72 rounded-sm p-0 '>
          <div className='flex h-full flex-col items-center gap-3'>
            {emptyStatus.map((status) => (
              <div key={status.id}>
                <div className=' w-72 rounded-sm p-0 '>
                  <div className='flex flex-row items-center justify-between rounded-sm bg-zinc-100 px-2 py-3'>
                    <div className='flex flex-row items-center gap-2 '>
                      {statusIconMapper(status.label, 'h-4 w-4')}
                      <Heading size='1' className='text-gray-700'>
                        {status.label}
                      </Heading>
                    </div>

                    <NewIssue
                      button={false}
                      projectid={projectId}
                      reload={reload}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
