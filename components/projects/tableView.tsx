'use client';

import { NewIssue } from '@/components/newIssue';
import { isOverdue, dateFormater } from '@/lib/util';
import { Badge, Heading, Text } from '@radix-ui/themes';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import AssigneeAvatar from './AssigneeAvatar';
import { LabelList } from '../issues/label';
import IssueMenuContext from '../issues/boards/issueMenuContext';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from '../ui/context-menu';
import { Button } from '../ui/button';

export interface TableViewProps {
  groupedIssues: any[];
  reload: () => void;
  projectId?: number;
}

type Issue = {
  id: number;
  title: string;
  deadline: string;
  priority: number;
  projectid?: number;
  statusid: number;
};

export default function TableView({
  groupedIssues,
  reload,
  projectId,
}: TableViewProps) {
  return (
    <div className='flex h-full w-full flex-col '>
      <Table className='w-full  divide-y-0 overflow-hidden rounded-sm border-gray-100 bg-white shadow-none'>
        {groupedIssues.map((grouping) => (
          <>
            <TableHeader className='flex w-full border-b-gray-100 bg-gray-50 '>
              <TableRow className='flex w-full items-center justify-between gap-3 px-3 py-2'>
                <Heading size='3' className='flex items-center gap-3'>
                  {/* {statusIconMapper(grouping.label, 'h-4 w-4')} */}
                  <Heading size='1' className='text-gray-700'>
                    {grouping.label}
                  </Heading>
                </Heading>
                <NewIssue
                  button={false}
                  reload={reload}
                  projectid={projectId}
                />
              </TableRow>
            </TableHeader>

            <TableBody>
              {grouping.issues &&
                grouping.issues.map((issue) => (
                  <TableRow
                    key={issue.id}
                    className='border-none border-b-gray-100'
                  >
                    <TableCell className='flex w-full items-center justify-between gap-3 '>
                      <ContextMenu>
                        <ContextMenuTrigger className='flex w-full w-full items-center justify-between gap-3'>
                          <p className='line-clamp-1 flex w-fit text-gray-700'>
                            {issue.title}
                          </p>

                          <div className='flex flex-grow  flex-row justify-between gap-2'>
                            <LabelList labels={issue.labels} />
                            <Text size='1' className=' text-2xs text-gray-500'>
                              {issue.assignees.length > 0 ? (
                                issue.assignees.map((assignee) => {
                                  return (
                                    <AssigneeAvatar
                                      key={assignee.id}
                                      assignee={assignee}
                                    />
                                  );
                                })
                              ) : (
                                <AssigneeAvatar />
                              )}
                            </Text>
                          </div>

                          <div className='flex w-fit flex-row items-center justify-end gap-2'>
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
                          </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <IssueMenuContext issue={issue} reload={reload} />
                        </ContextMenuContent>
                      </ContextMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </>
        ))}
      </Table>
    </div>
  );
}
