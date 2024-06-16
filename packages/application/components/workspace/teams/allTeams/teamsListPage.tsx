'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
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
  identifier: string;
}

export default function TeamsListPage() {
  const { currentWorkspace } = useContext(OrbitContext);
  const { teams, loading, error } = useWorkspaceTeams({
    workspaceId: currentWorkspace,
    fields: ['id', 'name', 'description', 'createdAt', 'updatedAt', 'identifier'],
  });

  if (loading) {
    return <> </>;
  }

  if (error) {
    toast('Could not fetch teams');
    return <div>{`:(`}</div>;
  }

  return <TableView teams={teams} />;
}

function TableView({ teams }: { teams: ITeam[] }) {
  return (
    <div className='flex w-full flex-grow flex-col overflow-scroll  '>
      <div className='flex w-full flex-col items-center justify-between    text-xs '>
        <Table className='w-full  overflow-hidden shadow-none '>
          <TableHeader>
            <TableRow className=' secondary-surface text-xs '>
              <TableHead>Name</TableHead>
              <TableHead>Identifier</TableHead>
              <TableHead>Description</TableHead>
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
                <TableCell>{team.identifier}</TableCell>
                <TableCell>{team.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
