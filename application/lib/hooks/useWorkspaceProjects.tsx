'use client';
import { gql, useQuery } from '@apollo/client';

export function useWorkspaceProjects({ workspaceId, fields }: { workspaceId: string; fields: string[] }) {
  const PROJECTS_QUERY = gql`
  query GetProjects($workspaceId: String!) {
    projects(workspaceId: $workspaceId) {
     ${fields.join('\n')}
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
