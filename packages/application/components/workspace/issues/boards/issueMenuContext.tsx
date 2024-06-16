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
import IssueStatusField from '../issue/standaloneFields/IssueStatusField';
import { IssueAssigneeField } from '../issue/fields/issueAssigneeField';
import { IssueLabelField } from '../issue/fields/issueLabelField';
import Link from 'next/link';
import { IssueProjectField } from '../issue/fields/issueProjectField';
import { useContext } from 'react';
import { IIssue } from '@/lib/types/issue';

export default function IssueMenuContext({ issue }: { issue: any }) {
  return (
    <>
      <ContextMenuItem className='flex flex-row items-center gap-3 text-sm'>
        <Link
          href={`/projects/${issue.projectid}/issues/${issue.id}`}
          shallow={true}
          aria-disabled={true}
          target='_blank'
          rel='noopener noreferrer'
          className='flex flex-row items-center gap-3 text-sm'
        >
          <ExternalLinkIcon className='h-4 w-4' />
          Open in new tab
        </Link>
      </ContextMenuItem>

      <ContextMenuSub>
        <ContextMenuItem className='flex flex-row items-center gap-3 text-sm'>
          <Trash2Icon className='h-4 w-4' />
          Delete
        </ContextMenuItem>
      </ContextMenuSub>
    </>
  );
}
