import { NewProject } from '@/components/workspace/projects/newProject';
import Link from 'next/link';
import { ArrowUpRightSquare } from 'lucide-react';
import { useContext } from 'react';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';

export default function TeamProjectsTab({ team }: { team: any }) {
  const { projects } = team;
  return (
    <div className='flex flex-col gap-4 p-1 px-4'>
      <div className='flex flex-row items-center justify-between'>
        <h1 className='text-md medium'>Projects</h1>
        <NewProject button={true} />
      </div>
      <div className='flex flex-col gap-2'>
        {projects.map((project: any) => (
          <TeamProject key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

function TeamProject({ project }: { project: any }) {
  const { currentWorkspace } = useContext(OrbitContext);
  return (
    <div className='flex flex-row items-center justify-between rounded-lg border bg-white p-2 px-3'>
      <div className='flex flex-1 flex-row items-center gap-4'>
        <h1 className='medium flex-1 text-xs'>{project.name}</h1>
        <Link href={`/orbit/workspace/${currentWorkspace}/projects/${project.id}`}>
          <ArrowUpRightSquare className='h-4 w-4 cursor-pointer text-gray-500' />
        </Link>
      </div>
    </div>
  );
}
