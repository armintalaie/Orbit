'use client';

import { NewIssue } from '@/components/newIssue';
import { CardHeader, CardContent } from '@/components/ui/card';
import { STATUS } from '@/lib/util';
import { Heading } from '@radix-ui/themes';
import { statusIconMapper } from '@/components/statusIconMapper';
import IssueCard from './IssueCard';

export interface KanbanViewProps {
  issues: {
    id: number;
    title: string;
    deadline: string;
    priority: number;
    projectid: number;
    statusid: number;
  }[];
  reload: () => void;
  projectId: number;
}

type Issue = {
  id: number;
  title: string;
  deadline: string;
  priority: number;
  projectid: number;
  statusid: number;
};

export default function KanbanView({
  issues,
  reload,
  projectId,
}: KanbanViewProps) {
  const status: { id: number; label: string }[] = STATUS || [];
  const groupedTasks = groupByStatus(issues);

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

  return (
    <div className='flex h-full flex-1 flex-row gap-12 overflow-scroll p-4 px-2'>
      {status.map((status) => (
        <div key={status.id}>
          <div className='h-full w-72 rounded-sm p-0 '>
            <CardHeader className='flex flex-row items-center justify-between px-1'>
              <div className='flex flex-row items-center gap-2'>
                {statusIconMapper(status.label, 'h-4 w-4')}
                <Heading size='1' className='text-gray-700'>
                  {status.label}
                </Heading>
              </div>

              <NewIssue button={false} projectid={projectId} reload={reload} />
            </CardHeader>
            <CardContent className='flex-1 overflow-y-auto p-0'>
              <ul className='space-y-3'>
                {groupedTasks[status.id] &&
                  groupedTasks[status.id].issues.map((issue) => (
                    <div key={issue.id}>
                      <IssueCard issue={issue} />
                    </div>
                  ))}
              </ul>
            </CardContent>
          </div>
        </div>
      ))}
    </div>
  );
}
