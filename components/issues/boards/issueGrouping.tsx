import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from '@/components/ui/select';
import { IIssue } from '@/lib/types/issue';
import { LABELS, STATUS } from '@/lib/util';
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
    configuration?: {
      hideEmpty?: boolean;
    };
  };
} = {
  statusid: {
    id: 'statusid',
    label: 'Status',
    options: {},
    configuration: {
      hideEmpty: false,
    },
  },
  projectid: {
    id: 'projectid',
    label: 'Project',
    options: {},
    configuration: {
      hideEmpty: false,
    },
  },
  labelid: {
    id: 'labelid',
    label: 'Label',
    options: {},
    configuration: {
      hideEmpty: false,
    },
  },
  team: {
    id: 'team',
    label: 'Team',
    options: {},
    configuration: {
      hideEmpty: false,
    },
  },
};

type GroupedIssues = {
  issues: IIssue[];
  key: string;
  label: string;
  configuration?: {
    hideEmpty?: boolean;
  };
}[];

export function IssueGrouping({
  issues,
  teamid,
  setIssues,
}: {
  issues: IIssue[];
  setIssues: (issues: GroupedIssues) => void;
  teamid?: number;
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

    if (selectedGrouping === 'labelid') {
      (issueAttributes['labelid'] as any).options = {
        ...LABELS.reduce((acc, curr) => {
          acc[curr.id] = { id: curr.id, label: curr.label };
          return acc;
        }, {}),
        ...{ 0: { id: 0, label: 'No Label' } },
      };
    }

    if (selectedGrouping === 'projectid') {
      const query = encodeURIComponent(
        JSON.stringify({ teams: [teamid] } || {})
      );
      const fetchURI = `/api/projects?q=${query}`;
      const fetchProjects = await fetch(`${fetchURI}`, {
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
          acc[project.id] = { id: project.id, label: project.title };
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

  for (const option of Object.values(issueAttributes[key].options)) {
    groupedIssues.push({
      issues: [],
      key: option.id,
      label: option.label,
    });
  }
  for (const issue of issues) {
    let shouldAdd = false;
    for (const groupedIssue of groupedIssues) {
      if (key === 'labelid') {
        if (issue.labels.length === 0 && groupedIssue.key === 0) {
          groupedIssue.issues.push(issue);
          shouldAdd = true;
          break;
        }
        if (issue.labels.map((label) => label.id).includes(groupedIssue.key)) {
          groupedIssue.issues.push(issue);
          shouldAdd = true;
          break;
        }
      } else {
        const issueKey = issue[groupingKey as keyof IIssue];
        if (groupedIssue.key === issueKey) {
          groupedIssue.issues.push(issue);
          shouldAdd = true;
          break;
        }
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
