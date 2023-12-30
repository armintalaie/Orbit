'use client';

import { STATUS, dateFormater, isOverdue } from '@/lib/util';
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
  ArrowLeftCircle,
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
import { useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '../ui/command';
import { Button } from '../ui/button';
import { statusIconMapper } from '../statusIconMapper';

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
                {issue.project_title}#{issue.id}
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
      <IssueMenuContext issue={issue} reload={reload} />
    </ContextMenu>
  );
}

let contextMenuOptions = [
  {
    id: 'open-in-new-tab',
    triggerComponent: (updateView, href) => (
      <ContextMenuItem
        onClick={() => {
          updateView();
        }}
      >
        <Link
          href={href}
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
    ),
    openComponent: null,
  },
  // {
  //   id: 'assign-to',
  //   triggerComponent: () => (<div className='flex flex-row items-center gap-3 text-sm'>
  //   <UserIcon className='h-4 w-4' />
  //   Assign to...
  // </div>),
  // },
  {
    id: 'set-status',

    triggerComponent: (updateView, href) => (
      <ContextMenuItem
        onClick={() => {
          updateView('set-status');
        }}
      >
        <div className='flex flex-row items-center gap-3 text-sm'>
          <CircleSlashIcon className='h-4 w-4' />
          Set Status...
        </div>
      </ContextMenuItem>
    ),
  },
  // {
  //   id: 'add-label',
  //   triggerComponent: () => (<div className='flex flex-row items-center gap-3 text-sm'>
  //   <TagsIcon className='h-4 w-4' />
  //   Add Label...
  // </div>),

  //   },
  //   {
  //     id: 'move-to',
  //     triggerComponent: () => (<div className='flex flex-row items-center gap-3 text-sm'>
  //     <Replace className='h-4 w-4' />
  //     Move to...
  //   </div>),

  //     },
  //     {
  //       id: 'delete',
  //       triggerComponent: () => (<div className='flex flex-row items-center gap-3 text-sm'>
  //       <Trash2Icon className='h-4 w-4' />
  //       Delete
  //     </div>),
  //     }
];

function SetStatusMenuComponent({
  issue,
}: {
  issue: any;
  backBtn: () => void;
}) {
  const status = STATUS || [];
  return (
    <Command className='rounded-md border-gray-200  bg-inherit '>
      <div className='flex h-full items-center gap-2'>
        <CommandInput placeholder='Search...' className='w-full border-none' />
      </div>

      <CommandEmpty>No status</CommandEmpty>
      <CommandGroup>
        {status.map((st) => (
          <CommandItem
            key={st.id}
            value={st.label}
            onSelect={(currentValue) => {
              // addFilter({ key: st.id, value: st.label, type: 'status' });
              // setOpen(false)
            }}
          >
            <div className='flex items-center gap-2'>
              {statusIconMapper(st.label, 'h-4 w-4')}
              <span>{st.label}</span>
            </div>
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  );
}

function IssueMenuContext({
  issue,
  reload,
}: {
  issue: any;
  reload: () => void;
}) {
  const [optionGroup, setOptionGroup] = useState('main');

  return (
    <ContextMenuContent className='w-62  rounded-md border border-gray-200 bg-gray-50  shadow-sm'>
      {optionGroup === 'main' &&
        contextMenuOptions.map((option) => {
          return option.triggerComponent(setOptionGroup, '');
        })}

      {optionGroup !== 'main' && (
        <ContextMenuItem
          className='flex flex-row items-center gap-3 text-sm'
          onClick={() => {
            setOptionGroup('main');
          }}
        >
          <ArrowLeftCircle className='h-4 w-4' />
          Back
        </ContextMenuItem>
      )}

      {/* {optionGroup === 'open-in-new-tab' && (}

   {optionGroup === 'assign-to' && (
    }
     */}

      {optionGroup === 'set-status' && (
        <SetStatusMenuComponent issue={issue} backBtn={() => {}} />
      )}

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
  );
}
