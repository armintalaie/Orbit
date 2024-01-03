'use client';

import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@/components/ui/context-menu';
import {
  ArrowUpCircleIcon,
  CircleSlash2Icon,
  ExternalLinkIcon,
  TagsIcon,
  Trash2Icon,
  UserCircle2Icon,
} from 'lucide-react';
import IssueStatusField from '../issue/fields/IssueStatusField';
import { IssueAssigneeField } from '../issue/fields/issueAssigneeField';
import { IssueLabelField } from '../issue/fields/issueLabelField';
import Link from 'next/link';
import { IssueProjectField } from '../issue/fields/issueProjectField';
import { useContext } from 'react';
import { OrbitContext } from '@/lib/context/OrbitContext';

export default function IssueMenuContext({
  issue,
  reload,
}: {
  issue: any;
  reload: () => void;
}) {
  const { fetcher } = useContext(OrbitContext);

  return (
    <ContextMenuContent className='w-62  rounded-md border border-gray-200 bg-white  shadow-sm'>
      <ContextMenuItem
        className='flex flex-row items-center gap-3 text-sm'
        onClick={() => {
          fetcher(`/api/issues/${issue.id}`, {
            method: 'DELETE',
          }).then(() => {
            reload && reload();
          });
        }}
      >
        <Link
          href={`/projects/${issue.projectid}/issues/${issue.id}`}
          shallow={true}
          aria-disabled={true}
          className='flex flex-row items-center gap-3 text-sm'
        >
          <ExternalLinkIcon className='h-4 w-4' />
          Open in new tab
        </Link>
      </ContextMenuItem>

      <ContextMenuSub>
        <ContextMenuSubTrigger
          inset
          className='flex flex-row items-center gap-3 px-2  text-sm'
        >
          <CircleSlash2Icon className='h-4 w-4' />
          Change status
        </ContextMenuSubTrigger>
        <ContextMenuSubContent className='w-56'>
          <IssueStatusField
            issueId={issue.id}
            statusId={issue.statusid}
            contentOnly={true}
          />
        </ContextMenuSubContent>
      </ContextMenuSub>

      <ContextMenuSub>
        <ContextMenuSubTrigger
          inset
          className='flex flex-row items-center gap-3 px-2  text-sm'
        >
          <UserCircle2Icon className='h-4 w-4' />
          Assign to...
        </ContextMenuSubTrigger>
        <ContextMenuSubContent className='w-60'>
          <IssueAssigneeField
            issueId={issue.id}
            user={issue.assignees ? issue.assignees[0] : null}
            team={{ id: issue.teamid, title: issue.team_title }}
            contentOnly={true}
          />
        </ContextMenuSubContent>
      </ContextMenuSub>

      <ContextMenuSub>
        <ContextMenuSubTrigger
          inset
          className='flex flex-row items-center gap-3 px-2  text-sm'
        >
          <TagsIcon className='h-4 w-4' />
          Edit labels
        </ContextMenuSubTrigger>
        <ContextMenuSubContent className='w-56'>
          <IssueLabelField
            issueId={issue.id}
            labels={issue.labels}
            contentOnly={true}
          />
        </ContextMenuSubContent>
      </ContextMenuSub>
      <ContextMenuSeparator />

      <ContextMenuSub>
        <ContextMenuSubTrigger
          inset
          className='flex flex-row items-center gap-3 px-2  text-sm'
        >
          <ArrowUpCircleIcon className='h-4 w-4' />
          Move to...
        </ContextMenuSubTrigger>
        <ContextMenuSubContent className='w-60'>
          <IssueProjectField
            issueId={issue.id}
            project={{ id: issue.projectid, title: issue.project_title }}
            contentOnly={true}
          />
        </ContextMenuSubContent>
      </ContextMenuSub>

      <ContextMenuItem
        className='flex flex-row items-center gap-3 text-sm'
        onClick={() => {
          fetcher(`/api/issues/${issue.id}`, {
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
