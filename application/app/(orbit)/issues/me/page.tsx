'use client';
import IssueBoard from '@/components/projects/IssueMainBoard';
import { UserSessionContext } from '@/lib/context/AuthProvider';
import { OrbitContext } from '@/lib/context/OrbitContext';
import { useOrbitSync } from '@/lib/hooks/useOrbitSync';
import { IIssue } from '@/lib/types/issue';
import { setDocumentMeta } from '@/lib/util';
import { useContext, useEffect, useState } from 'react';


export default function MyIssuePage() {
  const userSession = useContext(UserSessionContext);
  const [issues, setIssues] = useState<IIssue[]>([]);
  const { fetcher } = useContext(OrbitContext);
  const userId = userSession?.user?.id;
  let issueQuery = {
    q: {
      assignees: [userId],
    },
    showProject: true,
  };
  
  const { lastMessage } = useOrbitSync({
    channels: [`user:${userSession?.user?.id}`]
  });
  
  setDocumentMeta(`My Issues`);

  async function fetchIssues() {
    let route = `/api/issues?q=${encodeURIComponent(
      JSON.stringify(issueQuery.q || {})
    )}`;
    const res = await fetcher(`${route}`);
    const tasks = await res.json();
    setIssues(tasks);
  }


  function updateIssueSet(issue: IIssue) {
    const issueExists = issues.some((i) => i.id === issue.id);
    let newIssues = issues;
    if (issueExists) {
      newIssues = issues.map((i) => (i.id === issue.id ? issue : i));
    } else {
      newIssues = [...issues, issue];
    }
    setIssues(newIssues);
  }


  useEffect(() => {
    fetchIssues();
  },[]);

  useEffect(() => {
    if (lastMessage) {
      const issue = JSON.parse(lastMessage);
      updateIssueSet(issue);
    }
  }, [lastMessage]);

  return (
    <div className='flex h-full w-full flex-col'>
      <div className=' flex h-full w-full flex-1 flex-col '>
        <div className='flex h-12 w-full items-center justify-between p-4  px-4 dark:bg-neutral-900 '>
          <div className='flex flex-row items-center gap-2  '>
            <h1 className='text-md h-full pr-2 font-medium leading-tight text-gray-700 dark:text-neutral-200 '>
              My Issues
            </h1>
          </div>
          <div className='flex h-full items-center justify-center gap-2'></div>
        </div>
        {issueQuery.q.assignees.length > 0 && <IssueBoard query={issueQuery} issues={issues}/>}
      </div>
    </div>
  );
}
