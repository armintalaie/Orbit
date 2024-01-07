'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useContext } from 'react';
import Link from 'next/link';
import { NewTeam } from '@/components/newTeam';
import PageWrapper from '@/components/layouts/pageWrapper';
import { OrbitContext } from '@/lib/context/OrbitContext';
import { ITeam } from '@/lib/types/issue';
import { setDocumentMeta } from '@/lib/util';

export default function TeamPage() {
  const { teams, reload } = useContext(OrbitContext);
  setDocumentMeta(`Teams`);

  return (
    <PageWrapper>
      <PageWrapper.Header>
        <div className='flex w-full flex-row items-center justify-between gap-2'>
          <h1 className='text-md h-full pr-2 font-medium leading-tight text-gray-700 dark:text-neutral-300'>
            Your Teams
          </h1>
          <NewTeam button={true} reload={() => reload(['teams'])} />
        </div>
      </PageWrapper.Header>

      <PageWrapper.SubHeader>
        <PageWrapper.SubHeader>
          <div className='flex flex-row items-center gap-2'>
            <p className='h-full pr-2 text-xs font-medium leading-tight text-gray-700 dark:text-neutral-400'>
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
      <Table className='w-full  overflow-hidden border-gray-200 bg-white shadow-none dark:border-neutral-800 dark:bg-neutral-900'>
        <TableBody>
          {teams.map((team) => (
            <TableRow key={team.id}>
              <TableCell>
                <Link
                  href={`/teams/${team.id}`}
                  shallow={true}
                  className='p-1 text-xs underline'
                >
                  {team.name}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
