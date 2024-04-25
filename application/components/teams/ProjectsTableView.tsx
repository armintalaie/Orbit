import { IProject } from '@/lib/types/issue';
import { isOverdue, dateFormater } from '@/lib/util';
import { Maximize2 } from 'lucide-react';
import {
  TableHead,
  Table,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
} from '../ui/table';
import Link from 'next/link';
import { Badge } from '../ui/badge';

export default function ProjectsTableView({
  projects,
}: {
  projects: IProject[];
}) {
  return (
    <div className='flex  w-full flex-col overflow-hidden '>
      <Table className='w-full  overflow-hidden rounded-sm border-gray-200 bg-neutral-100 shadow-none dark:bg-neutral-900'>
        <TableHeader>
          <TableRow className='border-b-gray-100 bg-neutral-50  text-xs  dark:border-b-neutral-800 dark:bg-neutral-900'>
            <TableHead>Title</TableHead>
            <TableHead className='hidden lg:table-cell'>Description</TableHead>

            <TableHead>Deadline</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='text-xs  '>
          {projects.map((project: IProject) => (
            <TableRow
              className='border-b-gray-100 bg-white text-xs  dark:border-b-neutral-800 dark:bg-neutral-900'
              key={project.id}
            >
              <TableCell className='flex flex-row items-center gap-4'>
                <Link
                  href={`/projects/${project.id}`}
                  shallow={true}
                  className='text-xs underline'
                >
                  <Maximize2 className='h-3 w-3' />
                </Link>
                {project.title}
              </TableCell>

              <TableCell className='hidden lg:table-cell'>
                {project.description}
              </TableCell>

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
  );
}
