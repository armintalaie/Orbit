import  { ReactNode, isValidElement, cloneElement } from 'react';
import Spinner from './Spinner';

type ContentLoaderProps = {
  children: ReactNode;
  data: any;
  isLoading: boolean;
  error: Error | null;
  childProps: any;
  childDataProp: string;
};

export default function ContentLoader(props: ContentLoaderProps) {
  const { children, data, isLoading, error, childProps, childDataProp } = props;
  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isValidElement(children)) {
    return cloneElement(children, {
      ...childProps,
      [childDataProp]: data,
    });
  }

  return <></>;
}
