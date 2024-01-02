import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from '@/components/ui/select';
import { IIssue } from '@/lib/types/issue';
import { STATUS } from '@/lib/util';
import { Settings2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';

type AttributeOptions = {
  id: string;
  label: string;
};

const issueAttributes: {
  [key: string]: {
    id: string;
    label: string;
    options: { [key: number | string]: AttributeOptions };
  };
} = {
  statusid: {
    id: 'statusid',
    label: 'Status',
    options: {},
  },
  projectid: {
    id: 'projectid',
    label: 'Project',
    options: {},
  },
  //   labels: {
  //     id: 'labelid',
  //     label: 'Label',
  //     options: {},
  //   },
  //   assignees: {
  //     id: 'assignees',
  //     label: 'Assignee',
  //     options: {},
  //   },
  //   team: {
  //     id: 'team',
  //     label: 'Team',
  //     options: {},
  //   },
};

type GroupedIssues = {
  issues: IIssue[];
  key: string;
  label: string;
}[];

export function IssueGrouping({
  issues,
  setIssues,
}: {
  issues: IIssue[];
  setIssues: (issues: GroupedIssues) => void;
}) {
  const defaultGrouping = issueAttributes['statusid'].id;
  const [selectedGrouping, setSelectedGrouping] = useState(defaultGrouping);

  async function updateGrouping() {
    if (selectedGrouping === 'statusid') {
      (issueAttributes['statusid'] as any).options = STATUS.reduce(
        (acc, curr) => {
          acc[curr.id] = { id: curr.id, label: curr.label };
          return acc;
        },
        {}
      );
    }

    if (selectedGrouping === 'projectid') {
      const fetchProjects = await fetch(`/api/projects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 600,
        },
      });
      const projects = await fetchProjects.json();
      (issueAttributes['projectid'] as any).options = projects.reduce(
        (acc, project) => {
          acc[project.id] = { key: project.id, label: project.title };
          return acc;
        },
        {}
      );
    }

    setIssues(groupBykey(issues, selectedGrouping));
  }

  useEffect(() => {
    updateGrouping();
  }, [issues, selectedGrouping]);

  const onValueChange = (value: string) => {
    setSelectedGrouping(value);
  };

  return (
    <Select onValueChange={onValueChange} defaultValue={defaultGrouping}>
      <SelectTrigger className='flex h-6 w-fit  gap-1 p-1 text-xs'>
        <Settings2Icon className='mr-2 h-3 w-3' />
        Display
      </SelectTrigger>
      <SelectContent className=''>
        <SelectGroup className=''>
          {Object.keys(issueAttributes).map((key) => (
            <SelectItem
              key={key}
              value={issueAttributes[key].id}
              className='text-xs'
            >
              {issueAttributes[key].label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function groupBykey(issues: IIssue[], key: string): GroupedIssues {
  const groupingKey = issueAttributes[key]
    ? issueAttributes[key].id
    : issueAttributes['statusid'].id;

  const groupedIssues: GroupedIssues = [];
  for (const issue of issues) {
    let shouldAdd = false;
    for (const groupedIssue of groupedIssues) {
      const issueKey = issue[groupingKey as keyof IIssue];
      if (groupedIssue.key === issueKey) {
        groupedIssue.issues.push(issue);
        shouldAdd = true;
        break;
      }
    }
    if (!shouldAdd) {
      const key = issue[groupingKey as keyof IIssue] as number | string;
      groupedIssues.push({
        issues: [issue],
        key: key,
        label: issueAttributes[groupingKey].options[key]
          ? issueAttributes[groupingKey].options[key].label
          : 'invalid',
      });
    }
  }

  return groupedIssues;
}
