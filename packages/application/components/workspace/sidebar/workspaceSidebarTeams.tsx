'use client';

import { useContext } from 'react';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import Link from 'next/link';
import LinearSkeleton from '@/components/general/skeletons/linearSkeleton';
import { useWorkspaceTeams } from '@/lib/hooks/teams/useWorkspaceTeams';

export default function WorkspaceSidebarTeams() {
  const { currentWorkspace } = useContext(OrbitContext);
  const { teams, loading, error } = useWorkspaceTeams({ workspaceId: currentWorkspace, fields: ['id', 'name'] });

  if (error) {
    return <div>could not fetch projects</div>;
  }

  return (
    <div className='flex flex-1 flex-col gap-2 text-xs'>
      <Link href={`/orbit/workspace/${currentWorkspace}/teams`} className='text-xs font-medium'>
        Teams
      </Link>
      <div className='flex flex-col '>
        {loading ? (
          <LinearSkeleton />
        ) : (
          <>
            {teams.map((team: { id: string; name: string }) => (
              <Link
                className='rounded-md border  border-transparent p-1 hover:border-teal-700 hover:shadow-sm'
                href={`/orbit/workspace/${currentWorkspace}/teams/${team.id}`}
                shallow
                key={team.id}
              >
                {team.name}
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
