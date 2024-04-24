import { ReactNode, isValidElement, cloneElement, useContext } from 'react';
import Spinner from './Spinner';
import useSWR from 'swr';
import { OrbitContext } from '@/lib/context/OrbitContext';

type ContentLoaderProps = {
  children: ReactNode;
  route: string;
  childProps: any;
  childDataProp: string;
};

export default function ContentLoader(props: ContentLoaderProps) {
  const { route } = props;
  const { fetcher } = useContext(OrbitContext);
  const { children, childProps, childDataProp } = props;
  const { data, isLoading, error } = useSWR(route, {
    fetcher: () => fetcher(route).then((res) => res.json()),
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (isValidElement(children)) {
    return cloneElement(children, {
      ...childProps,
      [childDataProp]: data,
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
