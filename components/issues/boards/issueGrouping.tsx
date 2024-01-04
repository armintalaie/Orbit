import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { OrbitContext } from '@/lib/context/OrbitContext';
import { IIssue } from '@/lib/types/issue';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { Settings2Icon } from 'lucide-react';
import { useCallback, useContext, useEffect, useState } from 'react';

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
  // labelid: {
  //   id: 'labelid',
  //   label: 'Label',
  //   options: {},
  //   configuration: {
  //     hideEmpty: false,
  //   },
  // },
  teamid: {
    id: 'teamid',
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

type Grouping = {
  issues: GroupedIssues;
  key: string;
};

export function IssueGrouping({
  issues,
  setIssues,
}: {
  issues: IIssue[];
  setIssues: (grouping: Grouping) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pathname = usePathname();
  const defaultGrouping =
    searchParams.get('grouping') || issueAttributes['statusid'].id;
  const [selectedGrouping, setSelectedGrouping] = useState(defaultGrouping);
  const { status, labels, projects, teams } = useContext(OrbitContext);

  async function updateGrouping() {
    if (selectedGrouping === 'statusid') {
      (issueAttributes['statusid'] as any).options = status.reduce(
        (acc, curr) => {
          acc[curr.id] = { id: curr.id, label: curr.label };
          return acc;
        },
        {}
      );
    }

    if (selectedGrouping === 'labelid') {
      (issueAttributes['labelid'] as any).options = {
        ...labels.reduce((acc, curr) => {
          acc[curr.id] = { id: curr.id, label: curr.label };
          return acc;
        }, {}),
        ...{ 0: { id: 0, label: 'No Label' } },
      };
    }

    if (selectedGrouping === 'projectid') {
      (issueAttributes['projectid'] as any).options = projects.reduce(
        (acc, project) => {
          acc[project.id] = { id: project.id, label: project.title };
          return acc;
        },
        {}
      );
    }

    if (selectedGrouping === 'teamid') {
      (issueAttributes['teamid'] as any).options = teams.reduce((acc, team) => {
        acc[team.id] = { id: team.id, label: team.name };
        return acc;
      }, {});
    }
    setIssues(groupBykey(issues, selectedGrouping));
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
    router.push(
      pathname + '?' + createQueryString('grouping', selectedGrouping)
    );
  }, [selectedGrouping]);

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

function groupBykey(issues: IIssue[], key: string): Grouping {
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

  return {
    issues: groupedIssues,
    key: groupingKey,
  };
}
