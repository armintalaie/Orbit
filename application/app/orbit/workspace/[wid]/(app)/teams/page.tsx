import PageWrapper from '@/components/general/layouts/pageWrapper';
import NewTeamModal from '@/components/workspace/teams/allTeams/newTeam';
import TeamsListPage from '@/components/workspace/teams/allTeams/teamsListPage';
import type { Metadata } from 'next';
import PageWrapperComponent from '@/components/general/layouts/pageWrapperHeader';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Orbit teams',
  description: 'List of teams in the workspace',
};

export default function TeamsPage() {
  return (
    <PageWrapper>
      <PageWrapperComponent type={'header'}>
        <div>
          <div className=' flex w-full flex-row items-center justify-between gap-2'>
            <h1 className='h-full pr-2 text-sm font-medium leading-tight text-gray-700 dark:text-gray-200'>Teams</h1>
            <div>
              <NewTeamModal />
            </div>
          </div>
        </div>
      </PageWrapperComponent>
      <PageWrapperComponent type={'content'}>
        <Suspense fallback={<div>Loading...</div>}>
          <TeamsListPage />
        </Suspense>
      </PageWrapperComponent>
    </PageWrapper>
  );
}
