'use client';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { DocumentNode } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';
import ListView from './ListView';
import useIssueQuery from '@/lib/hooks/Issues/useIssueQuery';

export default function IssuesView({ query, variables }: { query: DocumentNode; variables: any }) {
  const { currentWorkspace } = useContext(OrbitContext);
  const [grouping, setGrouping] = useState('status');
  const [groupedIssues, setGroupedIssues] = useState<any[]>([]);
  const { issues, error, loading, changeQuery } = useIssueQuery({
    query,
    variables: {
      ...variables,
      workspaceId: currentWorkspace,
    },
  });

  useEffect(() => {
    if (issues.length > 0) {
      const grouped = groupIssues(issues, grouping);
      setGroupedIssues(grouped);
    }
  }, [issues, grouping]);

  function groupIssues(issues: any[], grouping: string) {
    const grouped = issues.reduce((acc, issue) => {
      let key = issue[grouping];
      if (typeof key === 'object') key = key.name;
      if (!acc[key]) {
        acc[key] = {
          label: key,
          issues: [issue],
        };
      } else {
        acc[key].issues.push(issue);
      }
      return acc;
    }, {} as any);
    return Object.values(grouped);
  }

  if (loading) return <div></div>;
  return (
    <ListView
      issues={groupedIssues}
      error={error}
      loading={loading}
      changeQuery={changeQuery}
      params={{ pid: variables.pid }}
    />
  );
}
