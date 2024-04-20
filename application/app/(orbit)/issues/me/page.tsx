'use client';
import ContentLoader from '@/components/general/ContentLoader';
import Spinner from '@/components/general/Spinner';
import IssueBoard from '@/components/projects/IssueMainBoard';
import { UserSessionContext } from '@/lib/context/AuthProvider';
import { OrbitContext } from '@/lib/context/OrbitContext';
import { useOrbitSync } from '@/lib/hooks/useOrbitSync';
import { IIssue } from '@/lib/types/issue';
import { setDocumentMeta } from '@/lib/util';
import { use, useContext, useEffect, useState } from 'react';
import useSWR from 'swr'



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

  let route = `/api/issues?q=${encodeURIComponent(
    JSON.stringify(issueQuery.q || {})
  )}`;

  const { data , isLoading, error} = useSWR(route, {
    fetcher: () => fetcher(route).then((res) => res.json())
  });
  
  
  useEffect(() => {
    if (data) {
      console.log(data);
      setIssues(data as unknown as IIssue[]);
    }
  }, [data]);

  setDocumentMeta(`My Issues`);


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
    if (lastMessage) {
      const issue = JSON.parse(lastMessage);
      updateIssueSet(issue);
    }
  }, [lastMessage]);

  function getContent() {
    if (error) return <div>failed to load</div>
    if (isLoading || true) return <Spinner />
    // return <IssueBoard query={issueQuery} issues={issues}/>
  }

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
        <ContentLoader isLoading={isLoading}  data={data} error={error} childProps={{ query: issueQuery}} childDataProp='issues'>
           <IssueBoard/>
        </ContentLoader>
      </div>
    </div>
  );
}
