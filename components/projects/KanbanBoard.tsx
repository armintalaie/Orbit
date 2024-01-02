'use client';

import { NewIssue } from '@/components/newIssue';
import { CardHeader, CardContent } from '@/components/ui/card';
import { Heading } from '@radix-ui/themes';
import IssueCard from './IssueCard';
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
  groupedIssues,
  reload,
  projectId,
}: KanbanViewProps) {
  return (
    <div className='flex h-full w-full flex-1 flex-row gap-12  overflow-hidden  overflow-x-scroll p-2 py-0'>
      <div className='flex h-full flex-grow  gap-4 '>
        {groupedIssues &&
          groupedIssues.map((grouping) => (
            <div
              key={grouping.key}
              className='flex h-full   flex-col  overflow-hidden'
            >
              <div
                key={grouping.label}
                className='flex h-full  w-72 flex-col rounded-sm  p-0 '
              >
                <CardHeader className='m-0 flex flex-row items-center justify-between space-y-0 px-1'>
                  <div className='m-0 flex flex-row items-center gap-2'>
                    {/* {statusIconMapper(status.label, 'h-4 w-4')} */}
                    <Heading
                      size='1'
                      className='flex items-center text-gray-700'
                    >
                      {grouping.label}
                    </Heading>
                  </div>

                  <NewIssue
                    button={false}
                    reload={reload}
                    defaultValues={{ projectId: projectId }}
                  />
                </CardHeader>
                <CardContent className='flex flex-grow  flex-col overflow-y-scroll p-0   '>
                  <ul className='flex flex-grow flex-col space-y-3  pb-3'>
                    {grouping.issues &&
                      grouping.issues.map((issue) => (
                        <div key={issue.id}>
                          <IssueCard issue={issue} reload={reload} />
                        </div>
                      ))}
                  </ul>
                </CardContent>
              </div>
            </div>
          ))}
      </div>
      {/* 
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
                      reload={reload}
                      defaultValues={{ projectId: projectId }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
}
