'use client';
import { NewIssue } from '@/components/newIssue';
import IssueBoard from '@/components/projects/IssueMainBoard';
import { UserSessionContext } from '@/lib/context/AuthProvider';
import { useContext, useEffect } from 'react';

export default function MyIssuePage() {
  const userSession = useContext(UserSessionContext);
  const userId = userSession?.user?.id;
  let issueQuery = {
    q: {
      assignees: [userId],
    },
    showProject: true,
  };

  return (
    <div className='flex h-full w-full flex-col'>
      <div className=' flex h-full w-full flex-1 flex-col '>
        <div className='flex h-12 w-full items-center justify-between p-4  px-4 '>
          <div className='flex flex-row items-center gap-2'>
            <h1 className='text-md h-full pr-2 font-medium leading-tight text-gray-700'>
              My Issues
            </h1>
          </div>
          <div className='flex h-full items-center justify-center gap-2'>
            <NewIssue button={true} />
          </div>
        </div>
        {issueQuery.q.assignees.length > 0 && <IssueBoard query={issueQuery} />}
      </div>
    </div>
  );
}
