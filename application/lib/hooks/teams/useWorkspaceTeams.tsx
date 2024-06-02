'use client';
import { gql, useQuery } from '@apollo/client';

export function useWorkspaceTeams({ workspaceId, fields }: { workspaceId: string; fields: any[] }) {
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
  const TEAMS_QUERY = gql`
  query GetTeams($workspaceId: String!) {
    teams(workspaceId: $workspaceId) {
     ${formatFields(fields)}
    }
  }
`;

  const { data, error, loading } = useQuery(TEAMS_QUERY, {
    variables: {
      workspaceId: workspaceId,
    },
  });

  return {
    teams: data?.teams || [],
    loading,
    error,
  };
}
