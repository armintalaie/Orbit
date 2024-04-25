import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useContext, useEffect, useState } from 'react';
import KanbanView from '@/components/projects/KanbanBoard';
import FilterGroup from '../issues/filterGroup';
import { IssueGrouping } from '../issues/boards/issueGrouping';
import { IIssue } from '@/lib/types/issue';
import { OrbitContext } from '@/lib/context/OrbitContext';
import { NewIssue } from '../newIssue';

interface IssueBoardProps {
  showProject?: boolean;
  defaultViewType?: ViewType;
  issues: IIssue[];
  query: any;
}

type ViewType = 'board' | 'table';

type GroupedIssues = {
  issues: IIssue[];
  key: string;
  label: string;
}[];

type Grouping = {
  issues: GroupedIssues;
  key: string;
};
export default function IssueBoard({ query, issues }: IssueBoardProps) {
  const [transformedIssues, setTransformedIssues] = useState<IIssue[]>([]);
  const [groupedIssues, setGroupedIssues] = useState<Grouping>({
    issues: [],
    key: '',
  });
  // const [viewType, setViewType] = useState<ViewType>('board');
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  let queryFilters = searchParams.get('filters');
  let defaultFilters = [];
  try {
    defaultFilters = queryFilters ? JSON.parse(queryFilters) : [];
  } catch (e) {
    defaultFilters = [];
  }
  const [filters, setFilters] = useState(defaultFilters);
  const [filterMethod, setFilterMethod] = useState('ANY');

  function updateIssueSet(issue: IIssue) {
    const issueExists = issues.some((i) => i.id === issue.id);
    let newIssues = issues;
    if (issueExists) {
      newIssues = issues.map((i) => (i.id === issue.id ? issue : i));
    } else {
      newIssues = [...issues, issue];
    }
    // setIssues(newIssues);
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
          let labelIds = issue.labels.map((label) => label.labelid.toString());
          if (!labelIds.includes(filter.key.toString())) {
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
          let labelIds = issue.labels.map((label) => label.id.toString());
          if (labelIds.includes(filter.key.toString())) {
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

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    filterOutIssues();
  }, [filters, issues, filterMethod]);

  useEffect(() => {
    if (filters.length === 0) {
      return;
    }
    const queriftyFilters = filters.map((filter) => {
      return `${filter.type}:${filter.key}`;
    });

    const qString = createQueryString('filters', queriftyFilters.join(','));
    router.push(pathname + '?' + qString);
  }, [filters]);

  useEffect(() => {
    // !issueProp && fetchIssues();
  }, []);

  return (
    <div className=' flex w-full flex-grow flex-col overflow-hidden bg-gray-50 dark:bg-neutral-900'>
      <div className='flex min-h-12 flex-row items-center justify-between gap-3 border-y border-gray-100 bg-white p-4 py-3 dark:border-neutral-800 dark:bg-neutral-900'>
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
            teamid={query.tid}
          />

          {/* <IssueViewOptions viewType={viewType} setViewType={setViewType} /> */}
          <NewIssue button={true} onIssueUpdate={updateIssueSet} />
        </div>
      </div>
      <div className=' flex   flex-grow flex-col overflow-hidden'>
        <KanbanView
          groupedIssues={groupedIssues}
          projectId={query.pid}
          onIssueUpdate={updateIssueSet}
        />
      </div>
    </div>
  );
}
