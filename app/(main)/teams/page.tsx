'use client';

import { TableIcon, BoxIcon } from '@radix-ui/react-icons';
import { Table, DropdownMenu } from '@radix-ui/themes';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useContext, useEffect, useState } from 'react';
import { FilterIcon } from 'lucide-react';
import Link from 'next/link';
import { NewTeam } from '@/components/newTeam';
import TeamGrid from '@/components/teams/teamGrid';
import { UserSessionContext } from '@/lib/context/AuthProvider';
import PageWrapper from '@/components/layouts/pageWrapper';

export default function TeamPage() {
  const [teams, setTeams] = useState([]);
  const viewTypes = ['board', 'table'];
  const [viewType, setViewType] = useState(viewTypes[1]);
  const userSession = useContext(UserSessionContext);

  async function reload() {
    const res = await fetch(`/api/teams`, {
      headers: {
        Authorization: `Bearer ${userSession?.access_token}`,
      },
    });
    const team = await res.json();
    setTeams(team);
  }

  useEffect(() => {
    async function fetchProjects() {
      const res = await fetch(`/api/teams`, {
        headers: {
          Authorization: `${userSession?.access_token}`,
        },
      });
      const teams = await res.json();
      setTeams(teams);
    }

    fetchProjects();
  }, []);

  return (
    <PageWrapper>
      <PageWrapper.Header>
        <div className='flex w-full flex-row items-center justify-between gap-2'>
          <h1 className='text-md h-full pr-2 font-medium leading-tight text-gray-700'>
            Your Teams
          </h1>
          <NewTeam button={true} reload={reload} />
        </div>
      </PageWrapper.Header>

      <PageWrapper.SubHeader>
        {/* <FilterGroup /> */}
        <div></div>

        <ToggleGroupDemo viewType={viewType} setViewType={setViewType} />
      </PageWrapper.SubHeader>

      <PageWrapper.Content>
        {viewType === 'board' ? (
          <TeamGrid teams={teams} />
        ) : (
          <TableView teams={teams} />
        )}
      </PageWrapper.Content>
    </PageWrapper>
  );
}

function TableView({ teams }) {
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

const ToggleGroupDemo = ({ viewType, setViewType }) => {
  return (
    <ToggleGroup.Root
      className='flex h-8 w-fit   flex-row  items-center justify-between divide-x divide-gray-200 overflow-hidden  rounded-sm border border-gray-200 bg-white text-left text-xs text-gray-500  shadow-sm'
      type='single'
      defaultValue='center'
      aria-label='Text alignment'
    >
      <ToggleGroup.Item
        className={`flex w-9 items-center justify-center p-2 ${
          viewType === 'table' ? 'bg-gray-100' : 'bg-inherit'
        }`}
        value='table'
        aria-label='Left aligned'
        onClick={() => setViewType('table')}
      >
        <TableIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={`flex w-9 items-center justify-center p-2 ${
          viewType === 'board' ? 'bg-gray-100' : 'bg-inherit'
        }`}
        value='board'
        aria-label='Center aligned'
        onClick={() => setViewType('board')}
      >
        <BoxIcon />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};
