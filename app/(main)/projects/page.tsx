'use client';

import { NewProject } from '@/components/newProject';
import { dateFormater, isOverdue } from '@/lib/util';
import { Badge, Table } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface IProject {
  id: number;
  title: string;
  description: string;
  datecreated: string;
  dateupdated: string;
  datestarted: string;
  deadline: string;
  statusid: number;
}

export default function ProjectPage() {
  const [projects, setProjects] = useState<IProject[]>([]);

  async function reload() {
    const res = await fetch(`/api/projects`);
    const project = await res.json();
    setProjects(project);
  }

  useEffect(() => {
    async function fetchProjects() {
      const res = await fetch(`/api/projects`);
      const project = await res.json();
      setProjects(project);
    }

    fetchProjects();
  }, []);

  return (
    <div className='flex min-h-screen w-full flex-col'>
      <div className=' flex h-full w-full flex-1 flex-col '>
        <div className='flex h-12 w-full items-center justify-between p-4  px-4 '>
          <h1 className='text-md h-full font-medium leading-tight text-gray-700'>
            Projects
          </h1>
          <div className='flex h-full items-center justify-center gap-2'>
            <NewProject button={true} reload={reload} />
          </div>
        </div>

        <div className=' flex h-full w-full flex-1 flex-col bg-gray-50 '>
          <div className='flex h-12 flex-row items-center justify-between border-y border-gray-100 bg-white p-2 py-3'></div>
          <div className=' flex h-full flex-grow flex-col'>
            <TableView projects={projects} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TableView({ projects }: { projects: IProject[] }) {
  return (
    <div className='flex h-full w-full flex-col '>
      <Table.Root className='w-full  overflow-hidden rounded-sm border-gray-200 bg-white shadow-none'>
        <Table.Body>
          {projects.map((project) => (
            <Table.Row key={project.id}>
              <Table.RowHeaderCell>
                <Link
                  href={{
                    pathname: `/projects/${project.id}`,
                    query: { id: project.id, title: project.title },
                  }}
                  shallow={true}
                  className='underline'
                >
                  {project.title}
                </Link>
              </Table.RowHeaderCell>
              <Table.Cell>{project.description}</Table.Cell>
              <Table.Cell>{project.statusid}</Table.Cell>
              <Table.Cell>
                {isOverdue(project.deadline) ? (
                  <Badge color='red'>{dateFormater(project.deadline)}</Badge>
                ) : (
                  <Badge color='gray'> {dateFormater(project.deadline)}</Badge>
                )}
              </Table.Cell>
              <Table.Cell>{project.datecreated}</Table.Cell>
              <Table.Cell>{project.dateupdated}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
