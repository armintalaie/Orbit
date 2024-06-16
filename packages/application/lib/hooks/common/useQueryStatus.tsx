import { ApolloError } from '@apollo/client';
import { useEffect, useState } from 'react';
import { setTimeout } from '@wry/context';

export type QueryStatus = 'idle' | 'loading' | 'error' | 'success';

export default function useQueryStatus({
  loading,
  error,
  data,
}: {
  loading: boolean;
  error: ApolloError | undefined;
  data: any | null;
}): QueryStatus {
  const [status, setStatus] = useState<QueryStatus>('idle');

  useEffect(() => {
    if (loading) {
      setStatus('loading');
    } else if (error) {
      setStatus('error');
    } else if (data) {
      setStatus('success');
    } else {
      setStatus('idle');
    }
  }, [loading, error, data]);

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => {
        setStatus('idle');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return status;
}
