import {
  ReactNode,
  isValidElement,
  cloneElement,
  useContext,
  useState,
  useEffect,
} from 'react';
import Spinner from './Spinner';
import useSWR from 'swr';
import { OrbitContext } from '@/lib/context/OrbitContext';
import { useOrbitSync } from '@/lib/hooks/useOrbitSync';
import { IIssue } from '@/lib/types/issue';

type ContentLoaderProps = {
  children: ReactNode;
  route: string;
  childProps: any;
  childDataProp: string;
  syncChannels?: string[];
};

export default function ContentLoader(props: ContentLoaderProps) {
  const { route } = props;
  const { fetcher } = useContext(OrbitContext);
  const { children, childProps, childDataProp } = props;
  const { data, isLoading, error } = useSWR(route, {
    fetcher: () => fetcher(route).then((res) => res.json()),
  });
  const [reactiveData, setReactiveData] = useState<any>([]);
  const { lastMessage } = useOrbitSync({
    channels: props.syncChannels || [],
  });

  useEffect(() => {
    if (data) {
      setReactiveData(data);
    }
  }, [data]);

  useEffect(() => {
    if (lastMessage && !isLoading && !error && lastMessage.data) {
      const event = lastMessage.event;
      const issue = JSON.parse(lastMessage.data);
      issueSyncEvent(issue, reactiveData, setReactiveData, event);
    }
  }, [lastMessage]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (isValidElement(children)) {
    return cloneElement(children, {
      ...childProps,
      [childDataProp]: reactiveData,
    });
  }
  return <></>;
}

function ErrorDisplay({ error }: { error: Error }) {
  console.error(error);
  return (
    <div className='flex h-full items-center justify-center bg-zinc-100'>
      <div className='w-full max-w-md rounded-lg bg-zinc-50 p-3 px-5 text-center shadow'>
        <h1 className='text-lg font-semibold text-red-300'>
          An error occurred
        </h1>
        <div className='text-gray-500'>Please try again later.</div>
      </div>
    </div>
  );
}

function issueSyncEvent(
  issue: any,
  issues: IIssue[],
  setIssues: Function,
  event: any
) {
  if (event === 'delete') {
    const newIssues = issues.filter((i) => i.id !== issue.id);
    setIssues(newIssues);
    return;
  }

  const issueExists = issues.some((i) => i.id === issue.id);
  let newIssues = issues;
  if (issueExists) {
    newIssues = issues.map((i) => (i.id === issue.id ? issue : i));
  } else {
    newIssues = [...issues, issue];
  }
  setIssues(newIssues);
}
