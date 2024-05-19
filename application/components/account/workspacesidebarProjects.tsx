'use client';
import { useContext } from 'react';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import useSWR from 'swr';
import LinearSkeleton from '../general/linearSkeleton';
import Link from 'next/link';

export function useWorkspaceProjects() {
  const { currentWorkspace } = useContext(OrbitContext);
  const { data, isLoading, error } = useSWR(`/api/v2/workspaces/${currentWorkspace?.id}/projects`, (url) =>
    fetch(url).then((res) => res.json())
  );

  return {
    projects: data,
    isLoading,
    error,
  };
}

export default function WorkspaceProjects() {
  const { currentWorkspace } = useContext(OrbitContext);
  const { projects, isLoading, error } = useWorkspaceProjects();

  if (error) {
    return <div>could not fetch projects</div>;
  }

  return (
    <div className='flex flex-1 flex-col gap-2 text-sm'>
      <Link href={`/orbit/workspace/${currentWorkspace.id}/projects`} className='text-xs'>
        Projects
      </Link>
      <div className='flex flex-col '>
        {isLoading ? (
          <LinearSkeleton />
        ) : (
          <>
            {projects.map((project) => (
              <Link
                className='rounded-md border  border-transparent p-1 hover:border-teal-700 hover:shadow-sm'
                href={`/orbit/workspace/${currentWorkspace.id}/projects/${project.id}`}
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
