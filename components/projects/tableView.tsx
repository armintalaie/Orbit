'use client';

import { NewIssue } from '@/components/newIssue';
import { isOverdue, dateFormater, STATUS } from '@/lib/util';
import { Badge, Heading, Table } from '@radix-ui/themes';
import { statusIconMapper } from '../statusIconMapper';

export interface TableViewProps {
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

export default function TableView({
  issues,
  reload,
  projectId,
}: TableViewProps) {
  const status: { id: number; label: string }[] = STATUS || [];
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

  const groupedTasks = groupByStatus(issues);

  return (
    <div className='flex h-full w-full flex-col '>
      <Table.Root className='w-full  divide-y-0 overflow-hidden rounded-sm border-gray-100 bg-white shadow-none'>
        <Table.Body>
          {status.map((status) => (
            <>
              <Table.Row className='border-b-gray-100 bg-gray-50 '>
                <Table.Cell colSpan={5}>
                  <Heading size='3' className='flex items-center gap-3'>
                    {statusIconMapper(status.label, 'h-4 w-4')}
                    <Heading size='1' className='text-gray-700'>
                      {status.label}
                    </Heading>
                  </Heading>
                </Table.Cell>
              </Table.Row>
              {groupedTasks[status.id] &&
                groupedTasks[status.id].issues.map((issue) => (
                  <Table.Row
                    key={issue.id}
                    className='border-none border-b-gray-100'
                  >
                    <Table.RowHeaderCell>{issue.title}</Table.RowHeaderCell>
                    <Table.Cell>
                      {isOverdue(issue.deadline) ? (
                        <Badge color='red'>
                          {dateFormater(issue.deadline)}
                        </Badge>
                      ) : (
                        <Badge color='gray'>
                          {' '}
                          {dateFormater(issue.deadline)}
                        </Badge>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              <Table.Row className='bg-gray-100  '>
                <Table.Cell colSpan={5} className=' '>
                  <NewIssue
                    button={false}
                    reload={reload}
                    projectid={projectId}
                  />
                </Table.Cell>
              </Table.Row>
            </>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
