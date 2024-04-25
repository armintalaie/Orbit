'use client';
import ContentLoader from '@/components/general/ContentLoader';
import IssueBoard from '@/components/projects/IssueMainBoard';
import { UserSessionContext } from '@/lib/context/AuthProvider';
import { useOrbitSync } from '@/lib/hooks/useOrbitSync';
import { IIssue } from '@/lib/types/issue';
import { setDocumentMeta } from '@/lib/util';
import { useContext, useEffect, useState } from 'react';

export default function MyIssuePage() {
  setDocumentMeta(`My Issues`);
  const userSession = useContext(UserSessionContext);
  const [issues, setIssues] = useState<IIssue[]>([]);
  const userId = userSession?.user?.id;
  let issueQuery = {
    q: {
      assignees: [userId],
    },
    showProject: true,
  };

  const { lastMessage } = useOrbitSync({
    channels: [`user:${userSession?.user?.id}`],
  });

  const getRoute = () => {
    return `/api/issues?q=${encodeURIComponent(
      JSON.stringify(issueQuery.q || {})
    )}`;
  };

  return (
    <div className='flex h-full w-full flex-col'>
      <div className=' flex h-full w-full flex-1 flex-col '>
        <div className='flex h-12 w-full items-center justify-between p-4  px-4 dark:bg-neutral-900 '>
          <div className='flex flex-row items-center gap-2  '>
            <h1 className='h-full pr-2 text-sm font-medium leading-tight text-gray-700 dark:text-neutral-200 '>
              My Issues
            </h1>
          </div>
          <div className='flex h-full items-center justify-center gap-2'></div>
        </div>
        <ContentLoader
          route={getRoute()}
          childProps={{ query: issueQuery }}
          childDataProp='issues'
          syncChannels={[`user:${userId}`]}
        >
          <IssueBoard />
        </ContentLoader>
      </div>
    </div>
  );
}
