'use client';
import { useContext } from 'react';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import LinearSkeleton from '../general/skeletons/linearSkeleton';
import Link from 'next/link';
import { useWorkspaceProjects } from '@/lib/hooks/useWorkspaceProjects';

export default function WorkspaceProjects() {
  const { currentWorkspace } = useContext(OrbitContext);
  const { projects, loading, error } = useWorkspaceProjects({ workspaceId: currentWorkspace, fields: ['id', 'name'] });

  if (error) {
    return <div>could not fetch projects</div>;
  }

  return (
    <div className='flex flex-1 flex-col gap-2 text-xs'>
      <Link href={`/orbit/workspace/${currentWorkspace}/projects`} className='text-xs font-medium'>
        Projects
      </Link>
      <div className='flex flex-col '>
        {loading ? (
          <LinearSkeleton />
        ) : (
          <>
            {projects.map((project: { id: string; name: string }) => (
              <Link
                className='rounded-md border  border-transparent p-1 hover:border-teal-700 hover:shadow-sm'
                href={`/orbit/workspace/${currentWorkspace}/projects/${project.id}`}
                shallow
                key={project.id}
              >
                {project.name}
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
