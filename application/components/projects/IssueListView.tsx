'use client';

import { NewIssue } from '@/components/newIssue';
import { isOverdue, dateFormater } from '@/lib/util';
import { Badge, Text } from '@radix-ui/themes';
import AssigneeAvatar from './AssigneeAvatar';
import { LabelList } from '../issues/label';
import IssueMenuContext from '../issues/boards/issueMenuContext';
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '../ui/context-menu';
import Link from 'next/link';
import { IIssue, IProfile } from '@/lib/types/issue';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export interface TableViewProps {
  groupedIssues: any;
  reload: () => void;
  projectId?: number;
}

export default function IssueListView({ groupedIssues, reload }: TableViewProps) {
  return (
    <div className='flex h-full w-full flex-col '>
      <div className='flex w-full items-center justify-between gap-3 bg-gray-50 px-3 py-2'>
        <Alert className=''>
          <AlertTitle className='text-xs font-semibold text-gray-700'>Deprecated</AlertTitle>
          <AlertDescription>This view is deprecated. Please use the Kanban view instead.</AlertDescription>
        </Alert>
      </div>
      <div className='flex w-full flex-grow flex-col divide-y-0  overflow-y-scroll  rounded-sm border-gray-100 bg-white shadow-none'>
        {groupedIssues.issues.map((grouping: any) => (
          <>
            <div className='flex w-full border-b border-t border-gray-200 bg-gray-100 '>
              <div className='flex w-full items-center justify-between gap-3 px-3 py-2'>
                <div className='flex items-center gap-3'>
                  <div className='text-xs font-semibold text-gray-700'>{grouping.label}</div>
                </div>
                <NewIssue button={false} reload={reload} />
              </div>
            </div>

            <ul className='flex flex-col divide-y divide-gray-200 '>
              {grouping.issues &&
                grouping.issues.map((issue: IIssue) => (
                  <li key={issue.id} className=' border-b-gray-100 p-2 py-3'>
                    <div className='flex w-full items-center justify-between gap-3 '>
                      <ContextMenu>
                        <ContextMenuTrigger className='flex w-full items-center justify-between gap-3'>
                          <Link
                            className='line-clamp-1 flex w-fit border-b  border-gray-200 text-xs text-gray-700'
                            href={`/projects/${issue.projectid}/issues/${issue.id}`}
                          >
                            {issue.title}
                          </Link>

                          <div className='flex flex-grow flex-row justify-between gap-2'>
                            <LabelList labels={issue.labels} />
                            <p className=' text-2xs text-xs text-gray-500'>
                              {issue.assignees.length > 0 ? (
                                issue.assignees.map((assignee: IProfile) => {
                                  return <AssigneeAvatar key={assignee.id} assignee={assignee} />;
                                })
                              ) : (
                                <AssigneeAvatar />
                              )}
                            </p>
                          </div>

                          <div className='flex w-fit flex-row items-center justify-end gap-2'>
                            {isOverdue(issue.deadline) ? (
                              <Badge color='red'>{dateFormater(issue.deadline)}</Badge>
                            ) : (
                              <Badge color='gray'> {dateFormater(issue.deadline)}</Badge>
                            )}
                          </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <IssueMenuContext issue={issue} reload={reload} />
                        </ContextMenuContent>
                      </ContextMenu>
                    </div>
                  </li>
                ))}
            </ul>
          </>
        ))}
      </div>
    </div>
  );
}
