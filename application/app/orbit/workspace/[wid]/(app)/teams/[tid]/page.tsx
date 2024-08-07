'use client';

import PageWrapper from '@/components/general/layouts/pageWrapper';
import { gql, useQuery } from '@apollo/client';
import TeamTabs from '@/components/workspace/teams/team/pageSections/teamTabs';
import { TeamNameInput } from '@/components/workspace/teams/team/standaloneFields/TeamNameField';
import TeamPageContent from '@/components/workspace/teams/team/pageSections/teamPageContent';
import { NewIssue } from '@/components/workspace/issues/newIssue';
import PageWrapperComponent from '@/components/general/layouts/pageWrapperHeader';

export default function TeamPage({ params }: { params: { wid: string; tid: string } }) {
  const { team, loading } = useTeam({ tid: params.tid, wid: params.wid });

  if (loading)
    return <div className={'primary-surface flex h-full w-full flex-col items-center justify-center gap-2 '}></div>;

  return (
    <PageWrapper>
      <PageWrapperComponent type={'header'}>
        <div className='flex  flex-row items-center gap-2'>
          <TeamNameInput teamId={team.id} defaultValue={team.name} />
        </div>
        <div className='flex h-full items-center justify-center gap-2'>
          <NewIssue button={true} />
        </div>
      </PageWrapperComponent>
      <PageWrapperComponent type={'content'}>
        <TeamPageContent params={params} />
      </PageWrapperComponent>
      <PageWrapperComponent type={'sideContent'}>
        <div className='flex flex-col gap-4'>
          <TeamTabs team={team} workspaceId={params.wid} />
        </div>
      </PageWrapperComponent>
    </PageWrapper>
  );
}

function useTeam({ tid, wid }: { tid: string; wid: string }) {
  const QUERY = gql`
    query GetTeam($tid: String!, $wid: String!) {
      team(id: $tid, workspaceId: $wid) {
        id
        name
        description
        members {
          id
          email
          profile {
            firstName
            lastName
            avatar
            username
          }
        }
        projects {
          id
          name
          description
        }
        updatedAt
        createdAt
      }
    }
  `;
  const { data, error, loading } = useQuery(QUERY, {
    variables: {
      tid,
      wid,
    },
  });

  return {
    team: data?.team as { [key: string]: any },
    error,
    loading,
  };
}
