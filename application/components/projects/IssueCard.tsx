'use client';

import { dateFormater, isOverdue } from '@/lib/util';
import Link from 'next/link';
import AssigneeAvatar from './AssigneeAvatar';
import { LabelList } from '../issues/label';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import IssueMenuContext from '../issues/boards/issueMenuContext';
import { IIssue } from '@/lib/types/issue';

export interface IssueCardProps {
  issue: IIssue;
  reload?: (issue?: IIssue) => void;
}

export default function IssueCard({ issue, reload }: IssueCardProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Link
          href={`/projects/${issue.projectid}/issues/${issue.id}`}
          shallow={true}
          aria-disabled={true}
        >
          <div className='flex flex-col gap-2 rounded-md border border-gray-200 bg-white  p-2 transition-all  hover:border-gray-300 hover:shadow-sm dark:border-neutral-900 dark:bg-neutral-800'>
            <div className='flex w-full flex-row justify-between gap-2 py-0'>
              <p className='text-2xs text-gray-600 dark:text-gray-400'>
                {issue.project_title}#{issue.id}
              </p>
              {isOverdue(issue.deadline) ? (
                <span className='line-clamp-1 text-2xs text-red-500'>
                  {dateFormater(issue.deadline)}
                </span>
              ) : (
                <span className='text-2xs text-gray-600'>
                  {' '}
                  {dateFormater(issue.deadline)}
                </span>
              )}
            </div>
            <p className='pb-2  text-xs text-gray-800 dark:text-gray-200'>
              {issue.title}
            </p>

            <div className='flex w-full flex-row justify-between gap-2'>
              <LabelList labels={issue.labels} />
              <p className=' text-2xs text-gray-500'>
                {issue.assignees.length > 0 ? (
                  issue.assignees.map((assignee) => {
                    return (
                      <AssigneeAvatar key={assignee.id} assignee={assignee} />
                    );
                  })
                ) : (
                  <AssigneeAvatar />
                )}
              </p>
            </div>
          </div>
        </Link>
      </ContextMenuTrigger>
      <IssueMenuContext issue={issue} reload={reload} />
    </ContextMenu>
  );
}
