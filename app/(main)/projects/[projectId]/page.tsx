'use client';

import { NewIssue } from '@/components/newIssue';
import { TableIcon, BoxIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Button } from '@radix-ui/themes';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
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
import KanbanView from '@/components/projects/KanbanBoard';
import TableView from '@/components/projects/tableView';

interface ProjectPageProps {
  id: number;
  title: string;
}

type ViewType = 'board' | 'table' | 'timeline';

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

  const [issues, setIssues] = useState([]);
  const [project, setProject] = useState<IProject>({
    id: projectId,
    title: title ? title : '',
    description: '',
    created_at: '',
    updated_at: '',
  });

  const DEFAULT_VIEW_TYPE = 'board';
  const [viewType, setViewType] = useState<ViewType>(DEFAULT_VIEW_TYPE);

  async function fetchIssues() {
    const res = await fetch(`/api/projects/${projectId}/issues`);
    const tasks = await res.json();
    setIssues(tasks);
  }

  async function fetchProject() {
    const res = await fetch(`/api/projects/${projectId}`);
    const project = await res.json();
    setProject(project);
  }

  useEffect(() => {
    fetchProject();
    fetchIssues();
  }, []);

  async function reload() {
    await fetchIssues();
  }

  return (
    <div className='flex min-h-screen w-full flex-col'>
      <div className=' flex h-full w-full flex-1 flex-col '>
        <div className='flex h-12 w-full items-center justify-between p-4  px-4 '>
          <div className='flex flex-row items-center gap-2'>
            <h1 className='text-md h-full pr-2 font-medium leading-tight text-gray-700'>
              {project.title}
            </h1>
            <ProjectOptions projectId={project.id} />
          </div>
          <div className='flex h-full items-center justify-center gap-2'>
            <NewIssue
              button={true}
              reload={fetchIssues}
              projectid={projectId}
            />
          </div>
        </div>
        <div className=' flex h-full w-full flex-1 flex-col bg-gray-50 '>
          <div className='flex h-12 flex-row items-center justify-between border-y border-gray-100 bg-white p-4 py-3'>
            <div></div>
            <ToggleGroupDemo viewType={viewType} setViewType={setViewType} />
          </div>
          <div className=' flex h-full flex-grow flex-col'>
            {viewType === 'table' ? (
              <TableView
                issues={issues}
                reload={reload}
                projectId={project.id}
              />
            ) : (
              <KanbanView
                issues={issues}
                reload={reload}
                projectId={project.id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const ToggleGroupDemo = ({
  viewType,
  setViewType,
}: {
  viewType: ViewType;
  setViewType: (viewType: ViewType) => void;
}) => {
  return (
    <ToggleGroup.Root
      className='flex h-8 w-fit   flex-row  items-center justify-between divide-x divide-gray-200 overflow-hidden  rounded-sm border border-gray-200 bg-white text-left text-xs text-gray-500  shadow-sm'
      type='single'
      defaultValue='center'
      aria-label='Text alignment'
    >
      <ToggleGroup.Item
        className={`flex w-9 items-center justify-center p-2 ${
          viewType === 'table' ? 'bg-gray-100' : 'bg-inherit'
        }`}
        value='table'
        aria-label='Left aligned'
        onClick={() => setViewType('table')}
      >
        <TableIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={`flex w-9 items-center justify-center p-2 ${
          viewType === 'board' ? 'bg-gray-100' : 'bg-inherit'
        }`}
        value='board'
        aria-label='Center aligned'
        onClick={() => setViewType('board')}
      >
        <BoxIcon />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};

function ProjectOptions({ projectId }: { projectId: number }) {
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
        <DropdownMenuItem>
          <Button variant='ghost' onClick={() => deleteProject()}>
            Delete project
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
