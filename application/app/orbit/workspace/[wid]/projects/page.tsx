'use client';

import { NewProject } from '@/components/projects/newProject';
import { dateFormater, isOverdue, setDocumentMeta } from '@/lib/util';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import PageWrapper from '@/components/layouts/pageWrapper';
import { useWorkspaceProjects } from '@/components/account/sidebar';
import Spinner from '@/components/general/Spinner';
interface IProject {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  targetDate: string;
  startDate: string;
}

export default function ProjectPage() {
  setDocumentMeta(`Projects`);
  const { projects, isLoading } = useWorkspaceProjects();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <PageWrapper>
      <PageWrapper.Header>
        <div className=' flex w-full flex-row items-center justify-between gap-2'>
          <h1 className='h-full pr-2 text-sm font-medium leading-tight text-gray-700 dark:text-gray-200'>Projects</h1>
          <NewProject button={true} />
        </div>
      </PageWrapper.Header>

      <PageWrapper.Content>
        <TableView projects={projects} />
      </PageWrapper.Content>
    </PageWrapper>
  );
}

function TableView({ projects }: { projects: IProject[] }) {
  return (
    <div className='flex w-full flex-grow flex-col overflow-scroll '>
      <div className='flex w-full flex-col items-center justify-between   text-xs '>
        <Table className='w-full  overflow-hidden rounded-sm  shadow-none '>
          <TableHeader>
            <TableRow className=' text-xs  '>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
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
                <TableCell>{project.description}</TableCell>
                <TableCell>
                  <Badge>{project.status}</Badge>
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
