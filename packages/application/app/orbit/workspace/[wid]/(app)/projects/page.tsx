'use client';

import { NewProject } from '@/components/workspace/projects/newProject';
import { dateFormater, setDocumentMeta } from '@/lib/util';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import PageWrapper from '@/components/general/layouts/pageWrapper';
import Spinner from '@/components/general/skeletons/Spinner';
import { useWorkspaceProjects } from '@/lib/hooks/useWorkspaceProjects';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { useContext } from 'react';
import { toast } from 'sonner';
import PageWrapperComponent from '@/components/general/layouts/pageWrapperHeader';
interface IProject {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: {
    id: number;
    name: string;
  };
  targetDate: string;
  startDate: string;
}

export default function ProjectPage() {
  setDocumentMeta(`Projects`);
  const { currentWorkspace } = useContext(OrbitContext);
  const { projects, loading, error } = useWorkspaceProjects({
    workspaceId: currentWorkspace,
    fields: ['id', 'name', 'startDate', 'targetDate', { status: ['id', 'name'] }],
  });

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    toast('Could not fetch projects');
    return <div>{`:(`}</div>;
  }

  return (
    <PageWrapper>
      <PageWrapperComponent type={'header'}>
        <div className=' flex w-full flex-row items-center justify-between gap-2'>
          <h1 className='h-full pr-2 text-sm font-medium leading-tight text-gray-700 dark:text-gray-200'>Projects</h1>
          <NewProject button={true} />
        </div>
      </PageWrapperComponent>

      <PageWrapperComponent type={'content'}>
        <TableView projects={projects} />
      </PageWrapperComponent>
    </PageWrapper>
  );
}

function TableView({ projects }: { projects: IProject[] }) {
  return (
    <div className='flex w-full flex-grow flex-col overflow-scroll p-2 '>
      <div className='flex w-full flex-col items-center justify-between   rounded-md   border text-xs '>
        <Table className='w-full  overflow-hidden rounded-sm  shadow-none '>
          <TableHeader>
            <TableRow className=' secondary-surface text-xs '>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Target Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='text-xs  '>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <Link href={`projects/${project.id}`} shallow={true} className='underline'>
                    {project.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge className='text-2xs h-6'>{project.status?.name ?? 'No status'}</Badge>
                </TableCell>
                <TableCell>{dateFormater(project.startDate)}</TableCell>
                <TableCell>{dateFormater(project.targetDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
