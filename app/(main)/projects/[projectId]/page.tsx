'use client';

import { NewIssue } from '@/components/newIssue';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Button } from '@radix-ui/themes';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import IssueBoard from '@/components/projects/IssueMainBoard';
import { DropdownMenuGroup } from '@radix-ui/react-dropdown-menu';

interface ProjectPageProps {
  id: number;
  title: string;
}

interface IProject {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export default function ProjectPage({ id, title }: ProjectPageProps) {
  const params = useParams();
  const projectId = id ? id : Number(params.projectId);
  const [project, setProject] = useState<IProject>({
    id: projectId,
    title: title ? title : '',
    description: '',
    created_at: '',
    updated_at: '',
  });

  async function fetchProject() {
    const res = await fetch(`/api/projects/${projectId}`);
    const project = await res.json();
    setProject(project);
  }

  useEffect(() => {
    fetchProject();
  }, []);

  return (
    <div className='flex h-full w-full flex-col'>
      <div className=' flex h-full w-full flex-1 flex-col '>
        <div className='flex h-12 w-full items-center justify-between p-4  px-4 '>
          <div className='flex flex-row items-center gap-2'>
            <h1 className='text-md h-full pr-2 font-medium leading-tight text-gray-700'>
              {project.title}
            </h1>
            <ProjectOptions projectId={project.id} />
          </div>
          <div className='flex h-full items-center justify-center gap-2'>
            {/* <NewIssue
              button={true}
              reload={fetchIssues}
              projectid={projectId}
            /> */}
          </div>
        </div>
        <IssueBoard pid={projectId} />
      </div>
    </div>
  );
}

function ProjectOptions({
  projectId,
  teamid,
}: {
  projectId: number;
  teamid?: number;
}) {
  const router = useRouter();

  async function deleteProject() {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error(res.statusText);
    router.push('/projects');
  }

  async function archiveProject() {
    const res = await fetch(`/api/projects/${projectId}/archive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error(res.statusText);
    router.push('/projects');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost'>
          <DotsHorizontalIcon className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>Project Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            {teamid ? (
              <Button variant='ghost' onClick={() => archiveProject()}>
                Change Team
              </Button>
            ) : (
              <Button variant='ghost' onClick={() => archiveProject()}>
                Assign Team
              </Button>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button variant='ghost' onClick={() => deleteProject()}>
            Delete project
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
