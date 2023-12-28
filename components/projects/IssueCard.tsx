'use client';

import { dateFormater, isOverdue } from '@/lib/util';
import { Box, Text } from '@radix-ui/themes';
import Link from 'next/link';
import AssigneeAvatar from './AssigneeAvatar';
import { LabelList } from '../issues/label';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  CalendarIcon,
  CircleDashedIcon,
  CircleSlashIcon,
  ExternalLinkIcon,
  PencilIcon,
  Replace,
  TagsIcon,
  Trash2Icon,
  UserIcon,
} from 'lucide-react';

export interface IssueCardProps {
  issue: {
    id: number;
    title: string;
    deadline: string;
    priority: number;
    projectid: number;
    statusid: number;
    assignees: {
      dateassigned: string;
      id: string;
      full_name: string;
      avatar_url: string;
    }[];
  };
  reload?: () => void;
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
          <Box className='flex flex-col gap-2 rounded-sm border border-gray-100 bg-white  p-2 '>
            <div className='flex w-full flex-row justify-between gap-2 py-0'>
              <Text size='1' className='text-gray-600'>
                #{issue.id}
              </Text>
              {isOverdue(issue.deadline) ? (
                <span className='text-xs text-red-500'>
                  {dateFormater(issue.deadline)}
                </span>
              ) : (
                <span className='text-xs text-gray-600'>
                  {' '}
                  {dateFormater(issue.deadline)}
                </span>
              )}
              {/* {issue.priority != 0 && (
            <Badge color='gray'>{'!'.repeat(issue.priority)}</Badge>
          )} */}
            </div>
            <Text size='1' className='pb-2 font-medium  text-gray-800'>
              {issue.title}
            </Text>

            <div className='flex w-full flex-row justify-between gap-2'>
              <LabelList labels={issue.labels} />
              <Text size='1' className=' text-2xs text-gray-500'>
                {issue.assignees.length > 0 ? (
                  issue.assignees.map((assignee) => {
                    return (
                      <AssigneeAvatar key={assignee.id} assignee={assignee} />
                    );
                  })
                ) : (
                  <AssigneeAvatar />
                )}
              </Text>
            </div>
          </Box>
        </Link>
      </ContextMenuTrigger>
      <ContextMenuContent className='w-48  rounded-md border border-gray-200 bg-gray-50  shadow-sm'>
        <ContextMenuItem className='flex flex-row items-center gap-3 text-sm'>
          <Link
            href={`/projects/${issue.projectid}/issues/${issue.id}`}
            shallow={true}
            aria-disabled={true}
            target='_blank'
            referrerPolicy='no-referrer'
            className='flex flex-row items-center gap-3 text-sm'
          >
            <ExternalLinkIcon className='h-4 w-4' />
            Open in new tab
          </Link>
        </ContextMenuItem>

        <ContextMenuItem className='flex flex-row items-center gap-3 text-sm'>
          <UserIcon className='h-4 w-4' />
          Assign to...
        </ContextMenuItem>
        <ContextMenuItem className='flex flex-row items-center gap-3 text-sm'>
          <CircleSlashIcon className='h-4 w-4' />
          Set Status...
        </ContextMenuItem>
        <ContextMenuItem className='flex flex-row items-center gap-3 text-sm'>
          <TagsIcon className='h-4 w-4' />
          Add Label...
        </ContextMenuItem>
        <ContextMenuItem className='flex flex-row items-center gap-3 text-sm'>
          <Replace className='h-4 w-4' />
          Move to...
        </ContextMenuItem>
        <ContextMenuItem
          className='flex flex-row items-center gap-3 text-sm'
          onClick={() => {
            fetch(`/api/projects/${issue.projectid}/issues/${issue.id}`, {
              method: 'DELETE',
            }).then(() => {
              reload && reload();
            });
          }}
        >
          <Trash2Icon className='h-4 w-4' />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
