'use client';
import { TableIcon, BoxIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Button } from '@radix-ui/themes';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
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
import { UserSessionContext } from '@/lib/context/AuthProvider';
import IssuesTimelineView from '../issues/IssueTimelineView';
import { GanttChartSquare } from 'lucide-react';
import FilterGroup from '../issues/filterGroup';

interface ProjectPageProps {
  pid?: number;
}

type ViewType = 'board' | 'table' | 'timeline';

export default function IssueBoard({ pid }: ProjectPageProps) {
  const userSession = useContext(UserSessionContext);
  const projectId = pid;
  const [issues, setIssues] = useState([]);
  const [transformedIssues, setTransformedIssues] = useState([]);
  const DEFAULT_VIEW_TYPE = 'board';
  const [viewType, setViewType] = useState<ViewType>(DEFAULT_VIEW_TYPE);
  const [filters, setFilters] = useState([]);

  async function fetchIssues() {
    const userId = userSession?.user?.id;
    const route = projectId
      ? `/api/projects/${projectId}/issues`
      : `/api/issues?q=${encodeURIComponent(
          JSON.stringify({ assignee: userId })
        )}`;
    const res = await fetch(`${route}`);
    const tasks = await res.json();
    setIssues(tasks);
  }

  useEffect(() => {
    const updatedIssues = [];
    if (filters.length === 0) {
      setTransformedIssues(issues);
      return;
    }

    for (const issue of issues) {
      let shouldAdd = true;
      for (const filter of filters) {
        if (filter.type === 'status') {
          if (filter.key !== issue.statusid) {
            shouldAdd = false;
            break;
          }
        }
        // else if (filter.type === 'assignee') {
        //   if (filter.value !== issue.assignee) {
        //     shouldAdd = false;
        //     break;
        //   }
        // } else if (filter.type === 'priority') {
        //   if (filter.value !== issue.priority) {
        //     shouldAdd = false;
        //     break;
        //   }
        // } else if (filter.type === 'deadline') {
        //   if (filter.value !== issue.deadline) {
        //     shouldAdd = false;
        //     break;
        //   }
        // } else if (filter.type === 'labels') {
        //   if (!issue.labels.includes(filter.value)) {
        //     shouldAdd = false;
        //     break;
        //   }
        // }
      }
      if (shouldAdd) {
        updatedIssues.push(issue);
      }
    }
    setTransformedIssues(updatedIssues);
  }, [filters, issues]);

  useEffect(() => {
    fetchIssues();
  }, []);

  async function reload() {
    await fetchIssues();
  }

  return (
    <div className=' flex h-full w-full flex-1 flex-col bg-gray-50'>
      <div className='flex h-12 flex-row items-center justify-between border-y border-gray-100 bg-white p-4 py-3'>
        <FilterGroup filters={filters} setFilters={setFilters} />
        <ToggleGroupDemo viewType={viewType} setViewType={setViewType} />
      </div>
      <div className=' flex h-full flex-grow flex-col'>
        {viewType === 'board' ? (
          <KanbanView
            issues={transformedIssues}
            reload={reload}
            projectId={projectId}
          />
        ) : viewType === 'table' ? (
          <TableView
            issues={transformedIssues}
            reload={reload}
            projectId={projectId}
          />
        ) : (
          <IssuesTimelineView
            issues={transformedIssues}
            projectId={projectId}
          />
        )}
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
      <ToggleGroup.Item
        className={`flex w-9 items-center justify-center p-2 ${
          viewType === 'timeline' ? 'bg-gray-100' : 'bg-inherit'
        }`}
        value='timeline'
        aria-label='Center aligned'
        onClick={() => setViewType('timeline')}
      >
        <GanttChartSquare className='stroke-1' />
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
