import { useQuery } from '@apollo/client';
import { useState } from 'react';

export default function useIssueQuery({ variables, query }: { variables: any; query: any }) {
  const [apiQuery, setApiQuery] = useState(query);
  const { data, error, loading } = useQuery(query, {
    variables,
  });

  async function changeQuery(newQuery: any) {
    setApiQuery(newQuery);
  }

  return {
    issues: data?.issues || [],
    error,
    loading,
    changeQuery,
  };
}
