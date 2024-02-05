import { IIssue } from '@/lib/types/issue';
import { GitBranchIcon } from 'lucide-react';
import {  useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import IssueStatusField from './fields/IssueStatusField';
import { IssueAssigneeField } from './fields/issueAssigneeField';
import { IssueProjectField } from './fields/issueProjectField';
import Link from 'next/link';
import { IssueLabelField } from './fields/issueLabelField';
import IssueDeadlineField from './fields/IssueDeadlineField';

export function IssueInfo({
  refIssue,
}: {
  issueId: number;
  refIssue: IIssue;
}) {
  const [IssueInfoFields, setIssueInfoFields] = useState(assignIssueInfoComponent(refIssue));

  useEffect(() => {
    setIssueInfoFields(() => assignIssueInfoComponent(refIssue))
  }
  , [refIssue]);  


  if (!refIssue || refIssue === null) {
    return null;
  }

  function assignIssueInfoComponent(issue: IIssue | null | undefined) {
    if (!issue) {
      return [];
    }
  
    return [
      {
        title: 'Status',
        value: <IssueStatusField statusId={issue.statusid} issueId={issue.id} />,
      },
      {
        title: 'Deadline',
        value: (
          <IssueDeadlineField
            date={
              issue.deadline !== null || issue.deadline
                ? new Date(issue.deadline)
                : undefined
            }
            issueId={issue.id}
          />
        ),
      },
      {
        title: 'Assignee',
        value: (
          <IssueAssigneeField
            issueId={issue.id}
            user={issue.assignees ? issue.assignees[0] : null}
            team={{ id: issue.teamid, title: issue.team_title }}
          />
        ),
      },
      {
        title: 'Project',
        value: (
          <IssueProjectField
            issueId={issue.id}
            project={{ id: issue.projectid, title: issue.project_title }}
          />
        ),
      },
    ]
  }


  return (
    <div className=' flex h-full w-full flex-col border-l border-gray-100 bg-white dark:border-neutral-800 dark:bg-neutral-900'>
      <div className='flex h-12 w-full items-center justify-end gap-6  bg-white p-4  px-4 dark:bg-neutral-900 '>
        <Button
          variant='ghost'
          className='p-0 hover:bg-inherit'
          onClick={() => {
            navigator.clipboard.writeText(
              `P${refIssue.projectid}-issue${refIssue.id}`
            );
            toast('Copied to clipboard');
          }}
        >
          <GitBranchIcon className='h-4 w-4' />
        </Button>
      </div>
      <div className='flex flex-grow flex-col justify-start gap-3 divide-y divide-gray-100 border-t border-gray-100 bg-white py-3  dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900'>
        <div className='flex  flex-col  gap-6   p-4 py-3'>
          {IssueInfoFields.map(({ title, value }) => (
            <div key={title} className='flex h-6 flex-row items-center  gap-2'>
              <p className='w-16 items-center  pr-2 text-2xs font-medium leading-tight text-gray-700 dark:text-gray-200'>
                {title}
              </p>
              <div className='flex-grow items-center   pr-2 text-2xs font-medium leading-tight text-gray-700 dark:text-gray-200'>
                {value}
              </div>
            </div>
          ))}
        </div>

        <div className='flex  flex-col  gap-6   p-4 py-3'>
          <div className='flex  flex-row   gap-2'>
            <p className='w-16 items-center  pr-2 text-2xs font-medium leading-tight text-gray-700 dark:text-gray-200'>
              Team
            </p>
            <div className='flex-grow items-center   pr-2 text-xs font-medium leading-tight text-gray-700 dark:text-gray-200'>
              <Link
                href={`/teams/${refIssue.teamid}`}
                target='_blank'
                referrerPolicy='no-referrer'
                className='border-b-2 border-b-gray-400 '
              >
                <p className='text-2xs font-medium   leading-tight text-gray-700 dark:text-neutral-300 '>
                  {refIssue.team_title}
                </p>
              </Link>
            </div>
          </div>
        </div>

        <div className='flex  flex-col  gap-6   p-4 py-3'>
          <div className='flex  flex-row   gap-2'>
            <div className='flex-grow items-center justify-start  pr-2 text-xs font-medium leading-tight text-gray-700'>
              <IssueLabelField issueId={refIssue.id} labels={refIssue.labels} />
            </div>
          </div>
        </div>

        <div className='flex  flex-col  gap-4   p-4 py-3'></div>
      </div>
    </div>
  );
}
