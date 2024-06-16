import { gql } from '@apollo/client';

export const UPDATE_TEAM = gql`
  mutation UpdateTeam($workspaceId: String!, $id: String!, $team: UpdateTeamInput!) {
    updateTeam(team: $team, id: $id, workspaceId: $workspaceId) {
      id
      name
      description
    }
  }
`;
