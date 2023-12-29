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
import {
  GanttChartSquare,
  KanbanIcon,
  KanbanSquareIcon,
  ListIcon,
} from 'lucide-react';
import FilterGroup from '../issues/filterGroup';

interface IssueBoardProps {
  query: {
    pid?: number | string;
    tid?: number | string;
    q?: object;
  };
  showProject?: boolean;
  defaultViewType?: ViewType;
}

type ViewType = 'board' | 'table' | 'timeline';

export default function IssueBoard({
  query,
  defaultViewType,
}: IssueBoardProps) {
  const projectId = query?.pid;
  const [issues, setIssues] = useState([]);
  const [transformedIssues, setTransformedIssues] = useState([]);
  const DEFAULT_VIEW_TYPE = defaultViewType || 'board';
  const [viewType, setViewType] = useState<ViewType>(DEFAULT_VIEW_TYPE);
  const [filters, setFilters] = useState([]);
  const [filterMethod, setFilterMethod] = useState('ANY');

  async function fetchIssues() {
    let route = `/api/issues?q=${encodeURIComponent(
      JSON.stringify(query.q || {})
    )}`;
    const res = await fetch(`${route}`);
    const tasks = await res.json();
    setIssues(tasks);
  }

  function filterOutIssues() {
    if (filterMethod === 'ALL') {
      filterByAnd();
    } else {
      filterByOr();
    }
  }

  function filterByAnd() {
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
        } else if (filter.type === 'label') {
          let labelIds = issue.labels.map((label) => label.labelid);
          if (!labelIds.includes(filter.key)) {
            shouldAdd = false;
            break;
          }
        } else if (filter.type === 'project') {
          if (filter.key !== issue.projectid) {
            shouldAdd = false;
            break;
          }
        }
      }
      if (shouldAdd) {
        updatedIssues.push(issue);
      }
    }
    setTransformedIssues(updatedIssues);
  }

  function filterByOr() {
    const updatedIssues = [];
    if (filters.length === 0) {
      setTransformedIssues(issues);
      return;
    }

    for (const issue of issues) {
      let shouldAdd = false;
      for (const filter of filters) {
        if (filter.type === 'status') {
          if (filter.key === issue.statusid) {
            shouldAdd = true;
            break;
          }
        } else if (filter.type === 'label') {
          let labelIds = issue.labels.map((label) => label.labelid);
          if (labelIds.includes(filter.key)) {
            shouldAdd = true;
            break;
          }
        } else if (filter.type === 'project') {
          if (filter.key === issue.projectid) {
            shouldAdd = true;
            break;
          }
        }
      }
      if (shouldAdd) {
        updatedIssues.push(issue);
      }
    }
    setTransformedIssues(updatedIssues);
  }

  useEffect(() => {
    filterOutIssues();
  }, [filters, issues, filterMethod]);

  useEffect(() => {
    fetchIssues();
  }, []);

  async function reload() {
    await fetchIssues();
  }

  return (
    <div className=' flex h-full w-full flex-1 flex-col bg-gray-50'>
      <div className='min-h-12 flex flex-row items-center justify-between gap-3 border-y border-gray-100 bg-white p-4 py-3'>
        <FilterGroup
          filters={filters}
          setFilters={setFilters}
          filterMethod={filterMethod}
          setFilterMethod={setFilterMethod}
        />
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
        <ListIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={`flex w-9 items-center justify-center p-2 ${
          viewType === 'board' ? 'bg-gray-100' : 'bg-inherit'
        }`}
        value='board'
        aria-label='Center aligned'
        onClick={() => setViewType('board')}
      >
        <KanbanSquareIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={`flex w-9 items-center justify-center p-2 ${
          viewType === 'timeline' ? 'bg-gray-100' : 'bg-inherit'
        }`}
        value='timeline'
        aria-label='Center aligned'
        onClick={() => setViewType('timeline')}
      >
        <GanttChartSquare />
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
