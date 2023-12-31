import { IIssue } from '@/lib/types/issue';
import { GitBranchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import IssueStatusField from './fields/IssueStatusField';
import { IssueDateField } from './fields/IssueDeadlineField';
import { IssueAssigneeField } from './fields/issueAssigneeField';
import { IssueProjectField } from './fields/issueProjectField';
import { IssueTextField } from './fields/issueTextField';
import Link from 'next/link';

export function IssueInfo({ issueId }: { issueId: number }) {
  const [issue, setIssue] = useState<IIssue | null>(null);

  const fetchIssue = async () => {
    const res = await fetch(`/api/issues/${issueId}`);
    const resultIssue = await res.json();
    if (!resultIssue) {
      return;
    }
    setIssue(resultIssue);
  };

  useEffect(() => {
    fetchIssue();
  }, []);

  if (!issue || issue === null) {
    return null;
  }

  const IssueInfoFields = [
    {
      title: 'Status',
      value: <IssueStatusField statusId={issue.statusid} issueId={issue.id} />,
    },
    {
      title: 'Deadline',
      value: <IssueDateField date={issue.deadline} issueId={issue.id} />,
    },
    {
      title: 'Assigned',
      value: <IssueDateField date={issue.datestarted} issueId={issue.id} />,
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

    {
      title: 'Team',
      value: (
        <Link href={`/teams/${issue.teamid}`} target='_blank' referrerPolicy='no-referrer' className='border-b-2 border-b-gray-400 '>
          <p className='text-xs font-medium   leading-tight text-gray-700 '>
            {issue.team_title}
          </p>
        </Link>
      ),
    },
  ];

  const isseuMetaInfo = [
    {
      title: 'Created',
      value: (
        <IssueTextField
          text={new Date(issue.datecreated).toLocaleDateString()}
        />
      ),
    },
    {
      title: 'Updated',
      value: (
        <IssueTextField
          text={new Date(issue.dateupdated).toLocaleDateString()}
        />
      ),
    },
  ];

  return (
    <div className=' flex  w-full flex-col border-l border-gray-100 bg-white '>
      <div className='flex h-12 w-full items-center justify-end gap-6  bg-white  p-4 px-4 '>
        <Button
          variant='ghost'
          className='p-0 hover:bg-inherit'
          onClick={() => {
            navigator.clipboard.writeText(
              `P${issue.projectid}-issue${issue.id}`
            );
            toast('Copied to clipboard');
          }}
        >
          <GitBranchIcon className='h-4 w-4' />
        </Button>
        {/* <Button
              className='p-0 hover:bg-inherit'
              variant='ghost'
              onClick={() => {
                navigator.clipboard.writeText(`${pathname}`);
              }}
            >
              <Clipboard className='h-4 w-4' />
            </Button> */}
      </div>
      <div className='flex flex-grow flex-col justify-between gap-3 divide-y divide-gray-100 border-t border-gray-100 bg-white  py-3'>
        <div className='flex  flex-col  gap-6   p-4 py-3'>
          {IssueInfoFields.map(({ title, value }) => (
            <div key={title} className='flex h-6 flex-row items-center  gap-2'>
              <p className='w-24 items-center  pr-2 text-xs font-medium leading-tight text-gray-700'>
                {title}
              </p>
              <div className='flex-grow items-center  pr-2 text-xs font-medium leading-tight text-gray-700'>
                {value}
              </div>
            </div>
          ))}
        </div>

        <div className='flex  flex-col  gap-6   p-4 py-3'>
          {/* {isseuMetaInfo.map(({ title, value }) => (
            <div key={title} className='flex h-6 flex-row items-center  gap-2'>
              <p className='w-24 items-center  pr-2 text-xs font-medium leading-tight text-gray-700'>
                {title}
              </p>
              <div className='items-center flex-grow  pr-2 text-xs font-medium leading-tight text-gray-700'>
                {value}
              </div>
            </div>
          ))} */}
        </div>
        <div className='flex  flex-col  gap-6   p-4 py-3'></div>

        <div className='flex  flex-col  gap-6   p-4 py-3'>
          {isseuMetaInfo.map(({ title, value }) => (
            <div key={title} className='flex h-6 flex-row items-center  gap-2'>
              <p className='w-24 items-center  pr-2 text-xs font-medium leading-tight text-gray-700'>
                {title}
              </p>
              <div className='flex-grow items-center  pr-2 text-xs font-medium leading-tight text-gray-700'>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
