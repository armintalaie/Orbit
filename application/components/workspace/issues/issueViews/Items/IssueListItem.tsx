'use client';

import Link from 'next/link';
import useLinkCreator from '@/lib/hooks/useLinkCreator';
import DateChip from './issueChips/dateChip';
import { IProfile } from '@/lib/types/issue';
import AssigneeChip from './issueChips/assigneeChip';
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '@/components/ui/context-menu';
import IssueMenuContext from '../../boards/issueMenuContext';
import {OrbitContext} from "@/lib/context/OrbitGeneralContext";
import {useContext} from "react";

export default function IssueItem({ issue }: { issue: any }) {
    const { currentWorkspace } = useContext(OrbitContext);
  return (
    <ContextMenu>
      <ContextMenuTrigger className='hover:secondary-surface flex w-full items-center justify-between gap-3 p-2'>
        <Link
          className='line-clamp-1 flex w-fit border-b   text-xs '
          href={`/orbit/workspace/${currentWorkspace}/issue/${issue.id}`}
        >
          {issue.title}
        </Link>

        <div className='flex flex-grow flex-row justify-between gap-2'>
          <p className=' text-2xs text-xs '>
            {issue.assignees.map((assignee: IProfile) => {
              return <AssigneeChip key={assignee.id} assignee={assignee} />;
            })}
          </p>
        </div>

        <div className='flex w-fit flex-row items-center justify-end gap-2'>
          <DateChip date={issue.targetDate} />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <IssueMenuContext issue={issue} />
      </ContextMenuContent>
    </ContextMenu>
  );
}
