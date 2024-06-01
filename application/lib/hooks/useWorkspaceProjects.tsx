'use client';
import { gql, useQuery } from '@apollo/client';

export function useWorkspaceProjects({ workspaceId, fields }: { workspaceId: string; fields: any[] }) {
  function formatFields(fields: any[]): any {
    return fields
      .map((field) => {
        if (typeof field === 'string') {
          return field;
        } else if (typeof field === 'object') {
          const key = Object.keys(field)[0];
          return `${key} { ${formatFields(field[key])} }`;
        }
      })
      .join('\n');
  }
  const PROJECTS_QUERY = gql`
  query GetProjects($workspaceId: String!) {
    projects(workspaceId: $workspaceId) {
     ${formatFields(fields)}
    }
  }
`;

  const { data, error, loading } = useQuery(PROJECTS_QUERY, {
    variables: {
      workspaceId: workspaceId,
    },
  });

  return {
    projects: data?.projects || [],
    loading,
    error,
  };
}
