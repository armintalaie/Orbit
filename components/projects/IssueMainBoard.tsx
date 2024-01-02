'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Button } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
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
import IssueListView from '@/components/projects/IssueListView';
import FilterGroup from '../issues/filterGroup';
import { IssueViewOptions } from '../issues/boards/IssueViewOptions';
import { IssueGrouping } from '../issues/boards/issueGrouping';
import { IIssue } from '@/lib/types/issue';
import { useWindowSize } from 'usehooks-ts';

interface IssueBoardProps {
  query: {
    pid?: number | string;
    tid?: number | string;
    q?: object;
  };
  showProject?: boolean;
  defaultViewType?: ViewType;
}

type ViewType = 'board' | 'table';

type GroupedIssues = {
  issues: IIssue[];
  key: string;
  label: string;
}[];

export default function IssueBoard({
  query,
  defaultViewType,
}: IssueBoardProps) {
  const { width } = useWindowSize();
  const projectId = query?.pid;
  const [issues, setIssues] = useState([]);
  const [transformedIssues, setTransformedIssues] = useState([]);
  const [groupedIssues, setGroupedIssues] = useState<GroupedIssues>([]);
  const [viewType, setViewType] = useState<ViewType>('board');
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
    <div className=' flex w-full flex-grow flex-col overflow-hidden bg-gray-50'>
      <div className='min-h-12 flex flex-row items-center justify-between gap-3 border-y border-gray-100 bg-white p-4 py-3'>
        <FilterGroup
          filters={filters}
          setFilters={setFilters}
          filterMethod={filterMethod}
          setFilterMethod={setFilterMethod}
        />
        <div className='flex flex-row items-center gap-3'>
          <IssueGrouping
            issues={transformedIssues}
            setIssues={setGroupedIssues}
          />
          <IssueViewOptions viewType={viewType} setViewType={setViewType} />
        </div>
      </div>
      <div className=' flex   flex-grow flex-col overflow-hidden'>
        {viewType === 'board' ? (
          <KanbanView
            groupedIssues={groupedIssues}
            reload={reload}
            projectId={projectId}
          />
        ) : (
          <IssueListView
            groupedIssues={groupedIssues}
            reload={reload}
            projectId={projectId}
          />
        )}
      </div>
    </div>
  );
}

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
