'use client';

import { dateFormater, isOverdue } from '@/lib/util';
import Link from 'next/link';
import AssigneeAvatar from './AssigneeAvatar';
import { LabelList } from '../issues/label';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import IssueMenuContext from '../issues/boards/issueMenuContext';
import { IIssue } from '@/lib/types/issue';
import { PreviewModalContext } from '@/lib/context/PreviewModalProvider';
import { useContext, useState } from 'react';
import IssuePage from '../issues/issue/IssuePage';
import { Button } from '../ui/button';
import { EyeIcon } from 'lucide-react';

export interface IssueCardProps {
  issue: IIssue;
  reload?: (issue?: IIssue) => void;
}

export default function IssueCard({ issue, reload }: IssueCardProps) {
  const { setIssueId } = useContext(PreviewModalContext);
  const [showPreviewButton, setShowPreviewButton] = useState(false);
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          onMouseOver={() => setShowPreviewButton(true)}
          onMouseLeave={() => setShowPreviewButton(false)}
          className='relative flex w-full flex-col py-2'
        >
          {showPreviewButton && (
            <Button
              variant={'outline'}
              size={'icon'}
              className=' transfrom absolute right-0 top-0 z-10 h-6 w-6 rounded-full p-1  text-neutral-400  dark:border-neutral-900 dark:bg-neutral-800 dark:text-neutral-300'
              onClick={(e) => {
                e.stopPropagation();
                setIssueId(Number(issue.id));
              }}
            >
              <EyeIcon className='h-4 w-4' />
            </Button>
          )}

          <Link
            href={`/projects/${issue.projectid}/issues/${issue.id}`}
            shallow={true}
            className='flex flex-row items-center gap-2'
          >
            <div className='flex  w-full flex-col gap-2 rounded-md border border-gray-200 bg-white  p-2 transition-all  hover:border-gray-300 hover:shadow-sm dark:border-neutral-900 dark:bg-neutral-800'>
              <div className='flex w-full flex-row justify-between gap-2 py-0'>
                <p className='text-2xs text-gray-600 dark:text-gray-400'>
                  {issue.project_title}#{issue.id}
                </p>
                <span className='text-2xs line-clamp-1 text-gray-600'>
                  {dateFormater(issue.deadline)}
                </span>
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
        </div>
      </ContextMenuTrigger>
      <IssueMenuContext issue={issue} reload={reload} />
    </ContextMenu>
  );
}
