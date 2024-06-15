import { useMutation, gql, MutationTuple } from '@apollo/client';

export const UPDATE_ISSUE = gql`
  mutation UpdateIssue($workspaceId: String!, $issue: UpdateIssueInput!, $id: String!) {
    updateIssue(workspaceId: $workspaceId, issue: $issue, id: $id) {
      id
      updatedAt
      title
      status {
        id
        name
      }
      targetDate
      startDate
      assignees {
        id
        email
        profile {
          firstName
          lastName
          avatar
        }
      }
    }
  }
`;

export function useCreateIssue({ workspaceId, issuePayload }: { workspaceId: string; issuePayload: any }) {
  const [mutate, { error, loading, data }] = useMutation(
    gql`
      mutation CreateIssue($workspaceId: String!, $issue: NewIssueInput!) {
        createIssue(workspaceId: $workspaceId, issue: $issue) {
          id
          title
          status
          targetDate
          startDate
          assignees {
            id
          }
        }
      }
    `,
    {
      variables: {
        workspaceId,
        issue: issuePayload,
      },
    }
  );

  return {
    createIssue: mutate,
    error,
    loading,
    data,
  };
}
