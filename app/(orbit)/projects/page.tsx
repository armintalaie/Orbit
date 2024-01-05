'use client';

import { NewProject } from '@/components/projects/newProject';
import { dateFormater, isOverdue, setDocumentMeta } from '@/lib/util';
import { Badge, Table } from '@radix-ui/themes';
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
  datestarted: string;
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
          <h1 className='text-md h-full pr-2 font-medium leading-tight text-gray-700'>
            Your Projects
          </h1>
          <NewProject button={true} reload={() => reload(['projects'])} />
        </div>
      </PageWrapper.Header>

      <PageWrapper.SubHeader>
        <div className='flex flex-row items-center gap-2'>
          <p className='h-full pr-2 text-xs font-medium leading-tight text-gray-700'>
            These are all the projects you have access to
          </p>
        </div>
      </PageWrapper.SubHeader>

      <PageWrapper.Content>
        <TableView projects={projects} />
      </PageWrapper.Content>
    </PageWrapper>
  );
}

function TableView({ projects }: { projects: IProject[] }) {
  return (
    <div className='flex w-full flex-grow flex-col overflow-scroll '>
      <div className='flex w-full flex-col items-center justify-between  bg-white  text-xs'>
        <Table.Root className='w-full  overflow-hidden rounded-sm border-gray-200 bg-white shadow-none'>
          <Table.Body className='text-xs  '>
            <Table.Row className='border-b-gray-100 bg-white text-xs  '>
              <Table.RowHeaderCell>Title</Table.RowHeaderCell>
              <Table.RowHeaderCell>Team</Table.RowHeaderCell>

              <Table.RowHeaderCell>Description</Table.RowHeaderCell>
              <Table.RowHeaderCell>Deadline</Table.RowHeaderCell>
            </Table.Row>
            {projects.map((project) => (
              <Table.Row key={project.id}>
                <Table.RowHeaderCell>
                  <Link
                    href={{
                      pathname: `/projects/${project.id}`,
                    }}
                    shallow={true}
                    className='underline'
                  >
                    {project.title}
                  </Link>
                </Table.RowHeaderCell>
                <Table.Cell>
                  <Link
                    href={{
                      pathname: `/teams/${project.teamid}`,
                      query: { id: project.teamid },
                    }}
                    shallow={true}
                    className='underline'
                  >
                    {project.team_title}
                  </Link>
                </Table.Cell>

                <Table.Cell>{project.description}</Table.Cell>
                <Table.Cell>
                  {isOverdue(project.deadline) ? (
                    <Badge color='red'>{dateFormater(project.deadline)}</Badge>
                  ) : (
                    <Badge color='gray'>
                      {' '}
                      {dateFormater(project.deadline)}
                    </Badge>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>
    </div>
  );
}
