'use client';

import IssuesView from '@/components/workspace/issues/issueViews';
import { gql, useQuery } from '@apollo/client';

export default function ProjectPageContent({ params }: { params: { wid: string; pid: string } }) {
  return <ProjectIssues projectId={params.pid} workspaceId={params.wid} />;
}

function ProjectIssues({ projectId, workspaceId }: { projectId: any; workspaceId: string }) {
  const q = gql`
    query GetIssues($wid: String!, $pid: String!) {
      issues(workspaceId: $wid, projectId: $pid) {
        id
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
  const variables = {
    wid: workspaceId,
    pid: projectId,
  };
  return <IssuesView query={q} variables={variables} />;
}
