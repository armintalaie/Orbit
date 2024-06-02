'use client';

import { setDocumentMeta } from '@/lib/util';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import PageWrapper from '@/components/general/layouts/pageWrapper';
import Spinner from '@/components/general/skeletons/Spinner';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { useContext } from 'react';
import { toast } from 'sonner';
import { useWorkspaceTeams } from '@/lib/hooks/teams/useWorkspaceTeams';
interface ITeam {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function TeamsPage() {
  setDocumentMeta(`Teams`);
  const { currentWorkspace } = useContext(OrbitContext);
  const { teams, loading, error } = useWorkspaceTeams({
    workspaceId: currentWorkspace,
    fields: ['id', 'name', 'description', 'createdAt', 'updatedAt'],
  });

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    toast('Could not fetch teams');
    return <div>{`:(`}</div>;
  }

  return (
    <PageWrapper>
      <PageWrapper.Header>
        <div className=' flex w-full flex-row items-center justify-between gap-2'>
          <h1 className='h-full pr-2 text-sm font-medium leading-tight text-gray-700 dark:text-gray-200'>Teams</h1>
        </div>
      </PageWrapper.Header>

      <PageWrapper.Content>
        <TableView teams={teams} />
      </PageWrapper.Content>
    </PageWrapper>
  );
}

function TableView({ teams }: { teams: ITeam[] }) {
  return (
    <div className='flex w-full flex-grow flex-col overflow-scroll p-2 '>
      <div className='flex w-full flex-col items-center justify-between   rounded-md   border text-xs '>
        <Table className='w-full  overflow-hidden rounded-sm  shadow-none '>
          <TableHeader>
            <TableRow className=' secondary-surface text-xs '>
              <TableHead>Name</TableHead>
              {/*<TableHead>Status</TableHead>*/}
              {/*<TableHead>Start Date</TableHead>*/}
              {/*<TableHead>Target Date</TableHead>*/}
            </TableRow>
          </TableHeader>
          <TableBody className='text-xs  '>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell>
                  <Link href={`teams/${team.id}`} shallow={true} className='underline'>
                    {team.name}
                  </Link>
                </TableCell>
                {/*<TableCell>*/}
                {/*    <Badge className='h-6 text-2xs'>{project.status?.name ?? 'No status'}</Badge>*/}
                {/*</TableCell>*/}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
