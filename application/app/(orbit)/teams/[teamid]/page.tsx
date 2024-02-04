'use client';

import { dateFormater, isOverdue, setDocumentMeta } from '@/lib/util';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Button } from '@radix-ui/themes';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useParams, useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import PageWrapper from '@/components/layouts/pageWrapper';
import { NewProject } from '@/components/projects/newProject';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import IssueBoard from '@/components/projects/IssueMainBoard';
import { Maximize2 } from 'lucide-react';
import { OrbitContext } from '@/lib/context/OrbitContext';
import { IIssue, IProject, ITeam } from '@/lib/types/issue';
import TeamMemberList from '@/components/teams/memberList';
import { useOrbitSync } from '@/lib/hooks/useOrbitSync';

type viewTypes = 'ISSUES' | 'PROJECTS';

export default function ProjectPage() {
  const { fetcher, projects: projectContext } = useContext(OrbitContext);
  const params = useParams();
  const projects = getProjects();
  const { teams: cachedTeams } = useContext(OrbitContext);
  const initialteam =
    cachedTeams &&
    cachedTeams.find((t) => t.id.toString() === params.teamid.toString());
  const [issues, setIssues] = useState<IIssue[]>([]);

  const [team, setTeam] = useState<ITeam | undefined>(initialteam);
  const { lastMessage } = useOrbitSync({
    channels: [`team:${team?.id}`],
  });
  const [viewType, setViewType] = useState<viewTypes>('ISSUES');
  const issueQuery = {
    tid: params.teamid,
    q: {
      teams: [params.teamid as string],
    },
    showProject: true,
  };


  function getProjects() {
    return projectContext.filter(
      (p) => p.teamid.toString() === params.teamid.toString()
    );
  }

  async function fetchTeam() {
    const res = await fetcher(`/api/teams/${params.teamid}`, {
      next: {
        tags: ['teams'],
      },
    });
    const team = await res.json();
    setDocumentMeta(`Team: ${team.name}`);
    setTeam(team);
  }

  useEffect(() => {
    fetchTeam();
  }, []);

  async function reload() {}

  async function fetchIssues() {
    let route = `/api/issues?q=${encodeURIComponent(
      JSON.stringify(issueQuery.q || {})
    )}`;
    const res = await fetcher(`${route}`);
    const tasks = await res.json();
    setIssues(tasks);
  }


  function updateIssueSet(issue: IIssue) {
    console.log('updateIssueSet', issue);
    const issueExists = issues.some((i) => i.id === issue.id);
    let newIssues = issues;
    if (issueExists) {
      newIssues = issues.map((i) => (i.id === issue.id ? issue : i));
    } else {
      newIssues = [...issues, issue];
    }
    setIssues(newIssues);
  }

  useEffect(() => {
    fetchIssues();
  }, []);


  useEffect(() => {
    if (lastMessage) {
      const issue = JSON.parse(lastMessage);
      updateIssueSet(issue);
    }
  }, [lastMessage]);




  if (!team) return <></>;

  const issueView = <IssueBoard issues={issues} query={issueQuery} />;

  return (
    <PageWrapper>
      <PageWrapper.Header>
        <div className='flex flex-row items-center'>
          <h1 className='text-md h-full  font-medium leading-tight text-gray-700 dark:text-neutral-300'>
            {team.name}
          </h1>
          <p className=' hidden flex-row items-center px-3 text-xs text-gray-500 dark:text-neutral-400 lg:flex'>
            {team.description}
          </p>
          <div className='flex items-center pl-2'>
            <TeamOptions teamId={team.id} />
          </div>
        </div>
        <div className='flex h-full items-center justify-center gap-2'>
          <ToggleTeamViewContents
            viewType={viewType}
            setViewType={setViewType}
          />
        </div>
      </PageWrapper.Header>

      <PageWrapper.Content>
        {viewType === 'ISSUES' ? (
          issueView
        ) : (
          <>
            <div className=' flex w-full  flex-col overflow-hidden pb-4   '>
              <div className='flex flex-row items-center justify-between px-4  '>
                <h2 className='text-md  py-3 font-medium leading-tight text-gray-700 dark:text-neutral-300'>
                  Projects
                </h2>
                <NewProject button={true} reload={reload} teamid={team.id} />
              </div>

              <ProjectsTableView projects={projects} />
            </div>

            <TeamMemberList teamid={params.teamid} reload={reload} />
          </>
        )}
      </PageWrapper.Content>
    </PageWrapper>
  );
}

const ToggleTeamViewContents = ({ viewType, setViewType }) => {
  return (
    <ToggleGroup
      type='single'
      value={viewType}
      onValueChange={setViewType}
      className='m-0 flex h-6 items-center rounded-sm  border border-gray-200 bg-gray-100 p-0 text-xs shadow-sm dark:border-neutral-900 dark:bg-neutral-800 '
    >
      <ToggleGroupItem
        className='m-0 flex h-full items-center gap-2 rounded-sm border-dashed p-1 px-2 text-xs text-gray-700 data-[state=on]:bg-white data-[state=on]:text-gray-700    dark:text-neutral-400 dark:data-[state=on]:bg-neutral-700 dark:data-[state=on]:text-neutral-300 '
        value='ISSUES'
      >
        Issues
      </ToggleGroupItem>
      <ToggleGroupItem
        className='m-0 flex h-full items-center gap-2  rounded-sm border-dashed p-1 px-2 text-xs  text-gray-700 data-[state=on]:bg-white data-[state=on]:text-gray-700 dark:text-neutral-400 dark:data-[state=on]:bg-neutral-700 dark:data-[state=on]:text-neutral-300'
        value='PROJECTS'
      >
        Projects
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

function TeamOptions({ teamId }: { teamId: string }) {
  const { reload, fetcher } = useContext(OrbitContext);
  const router = useRouter();
  async function deleteProject() {
    const res = await fetcher(`/api/teams/${teamId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    reload(['teams']);
    if (!res.ok) throw new Error(res.statusText);

    router.push('/teams');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost'>
          <DotsHorizontalIcon className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>Team Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button variant='ghost' onClick={() => deleteProject()}>
            Delete team
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProjectsTableView({ projects }: { projects: IProject[] }) {
  return (
    <div className='flex  w-full flex-col overflow-hidden '>
      <Table className='w-full  overflow-hidden rounded-sm border-gray-200 bg-white shadow-none dark:bg-neutral-900'>
        <TableHeader>
          <TableRow className='border-b-gray-100 bg-white text-xs  dark:border-b-neutral-800 dark:bg-neutral-900'>
            <TableHead>Title</TableHead>
            <TableHead className='hidden lg:table-cell'>Description</TableHead>

            <TableHead>Deadline</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='text-xs  '>
          {projects.map((project: IProject) => (
            <TableRow
              className='border-b-gray-100 bg-white text-xs  dark:border-b-neutral-800 dark:bg-neutral-900'
              key={project.id}
            >
              <TableCell className='flex flex-row items-center gap-4'>
                <Link
                  href={`/projects/${project.id}`}
                  shallow={true}
                  className='text-xs underline'
                >
                  <Maximize2 className='h-3 w-3' />
                </Link>
                {project.title}
              </TableCell>

              <TableCell className='hidden lg:table-cell'>
                {project.description}
              </TableCell>

              <TableCell>
                {isOverdue(project.deadline) ? (
                  <Badge color='red'>{dateFormater(project.deadline)}</Badge>
                ) : (
                  <Badge color='gray'> {dateFormater(project.deadline)}</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
