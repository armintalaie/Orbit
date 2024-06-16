import { gql } from '@apollo/client';

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($workspaceId: String!, $id: String!, $project: UpdateProjectInput!) {
    updateProject(project: $project, id: $id, workspaceId: $workspaceId) {
      id
      name
      description
      status {
        id
        name
      }
      targetDate
      startDate
    }
  }
`;
