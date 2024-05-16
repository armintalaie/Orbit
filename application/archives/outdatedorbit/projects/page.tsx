'use client';

import { NewProject } from '@/components/projects/newProject';
import { dateFormater, isOverdue, setDocumentMeta } from '@/lib/util';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useContext } from 'react';
import Link from 'next/link';
import PageWrapper from '@/components/layouts/pageWrapper';
import { OrbitContext } from '@/lib/context/OrbitContext';
interface IProject {
  id: number;
  title: string;
  description: string;
  datecreated: string;
  dateupdated: string;
  deadline: string;
  statusid: number;
  teamid: number;
  team_title: string;
}

export default function ProjectPage() {
  const { projects, reload } = useContext(OrbitContext);
  setDocumentMeta(`Projects`);

  return (
    <PageWrapper>
      <PageWrapper.Header>
        <div className=' flex w-full flex-row items-center justify-between gap-2'>
          <h1 className='h-full pr-2 text-sm font-medium leading-tight text-gray-700 dark:text-gray-200'>Projects</h1>
          <NewProject button={true} reload={() => reload(['projects'])} />
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
      <div className='flex w-full flex-col items-center justify-between  bg-white  text-xs dark:bg-neutral-900'>
        <Table className='w-full  overflow-hidden rounded-sm border-gray-200 bg-white shadow-none dark:bg-neutral-900'>
          <TableHeader>
            <TableRow className='border-b-gray-100 bg-white text-xs  dark:border-b-neutral-800 dark:bg-neutral-900'>
              <TableHead>Title</TableHead>
              <TableHead>Team</TableHead>

              <TableHead>Description</TableHead>
              <TableHead>Deadline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='text-xs  '>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <Link
                    href={{
                      pathname: `/projects/${project.id}`,
                    }}
                    shallow={true}
                    className='underline'
                  >
                    {project.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={{
                      pathname: `/teams/${project.teamid}`,
                      query: {
                        id: project.teamid,
                      },
                    }}
                    shallow={true}
                    className='underline'
                  >
                    {project.team_title}
                  </Link>
                </TableCell>

                <TableCell>{project.description}</TableCell>
                <TableCell>
                  {isOverdue(project.deadline) ? (
                    <Badge color='red'>{dateFormater(project.deadline)}</Badge>
                  ) : (
                    <Badge color='gray'> {dateFormater(project.deadline)}</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
