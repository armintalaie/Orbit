'use client';

import IssuesView from '@/components/workspace/issues/issueViews';
import { gql } from '@apollo/client';

export default function TeamPageContent({ params }: { params: { wid: string; tid: string } }) {
  return <TeamIssues teamId={params.tid} workspaceId={params.wid} />;
}

function TeamIssues({ teamId, workspaceId }: { teamId: any; workspaceId: string }) {
  const q = gql`
    query GetIssuesForTeam($wid: String!, $tid: String!) {
      issues(workspaceId: $wid, teamId: $tid) {
        id
        title
        status {
          id
          name
        }
        targetDate
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
  const variables = {
    wid: workspaceId,
    tid: teamId,
  };
  return <IssuesView query={q} variables={variables} />;
}
