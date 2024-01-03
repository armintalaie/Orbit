'use client';

import { Table } from '@radix-ui/themes';
import { useContext } from 'react';
import Link from 'next/link';
import { NewTeam } from '@/components/newTeam';
import PageWrapper from '@/components/layouts/pageWrapper';
import { OrbitContext } from '@/lib/context/OrbitContext';
import { ITeam } from '@/lib/types/issue';

export default function TeamPage() {
  const { teams, reload } = useContext(OrbitContext);

  return (
    <PageWrapper>
      <PageWrapper.Header>
        <div className='flex w-full flex-row items-center justify-between gap-2'>
          <h1 className='text-md h-full pr-2 font-medium leading-tight text-gray-700'>
            Your Teams
          </h1>
          <NewTeam button={true} reload={() => reload(['teams'])} />
        </div>
      </PageWrapper.Header>

      <PageWrapper.SubHeader>
        <PageWrapper.SubHeader>
          <div className='flex flex-row items-center gap-2'>
            <p className='h-full pr-2 text-xs font-medium leading-tight text-gray-700'>
              These are all the teams you have access to
            </p>
          </div>
        </PageWrapper.SubHeader>
      </PageWrapper.SubHeader>

      <PageWrapper.Content>
        <TableView teams={teams} />
      </PageWrapper.Content>
    </PageWrapper>
  );
}

function TableView({ teams }: { teams: ITeam[] }) {
  return (
    <div className='flex h-full w-full flex-col '>
      <Table.Root className='w-full  overflow-hidden border-gray-200 bg-white shadow-none dark:border-neutral-800 dark:bg-neutral-900'>
        <Table.Body>
          {teams.map((team) => (
            <Table.Row key={team.id}>
              <Table.RowHeaderCell>
                <Link
                  href={`/teams/${team.id}`}
                  shallow={true}
                  className='underline'
                >
                  {team.name}
                </Link>
              </Table.RowHeaderCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
