import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

export default function useWorkspaceConfigs({ workspaceId }: { workspaceId?: string }) {
  const checkCache = useMemo(() => {
    const stored = window.localStorage.getItem(`workspace-${workspaceId}`); // workspace-1, workspace-2, etc
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  }, [workspaceId]);

  const WORKSPACE_QUERY = useMemo(() => {
    return gql`
      query GetWorkspaceConfigs($workspaceId: String!) {
        workspace(id: $workspaceId) {
          id
          name
          config {
            issueStatus {
              id
              name
              description
            }
          }
        }
      }
    `;
  }, []);

  if (!workspaceId) {
    return {
      workspace: {},
      error: 'No workspace id provided',
      loading: false,
    };
  }

  if (checkCache) {
    return {
      workspace: checkCache,
      error: null,
      loading: false,
    };
  }

  const { data, error, loading } = useQuery(WORKSPACE_QUERY, {
    variables: {
      workspaceId,
    },
  });

  return {
    workspace: data?.workspace || {},
    error,
    loading,
  };
}
