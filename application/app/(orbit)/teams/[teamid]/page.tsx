'use client';
import { setDocumentMeta } from '@/lib/util';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PageWrapper from '@/components/layouts/pageWrapper';
import { NewProject } from '@/components/projects/newProject';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import IssueBoard from '@/components/projects/IssueMainBoard';
import { OrbitContext } from '@/lib/context/OrbitContext';
import { IIssue, ITeam } from '@/lib/types/issue';
import TeamMemberList from '@/components/teams/memberList';
import { useOrbitSync } from '@/lib/hooks/useOrbitSync';
import ContentLoader from '@/components/general/ContentLoader';
import TeamOptions from '@/components/teams/TeamOptions';
import ProjectsTableView from '@/components/teams/ProjectsTableView';

type viewTypes = 'ISSUES' | 'PROJECTS' | 'TEAM';

const ToggleTeamViewContents = ({
  viewType,
  setViewType,
}: {
  viewType: viewTypes;
  setViewType: (v: viewTypes) => void;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toggleClass = useMemo(() => {
    return 'm-0 flex h-full items-center gap-2 rounded-sm border-dashed p-1 px-2 text-xs text-gray-700 data-[state=on]:bg-white data-[state=on]:text-gray-700    dark:text-neutral-400 dark:data-[state=on]:bg-neutral-700 dark:data-[state=on]:text-neutral-300 ';
  }, []);

  const toggleOptions = useMemo(() => {
    return ['ISSUES', 'PROJECTS', 'TEAM'];
  }, []);

  useEffect(() => {
    if (!searchParams.get('view')) {
      setViewType('ISSUES');
      const queryString = createQueryString();
      router.push('?' + queryString);
    } else {
      setViewType(searchParams.get('view')?.toUpperCase() as viewTypes);
    }
  }, []);

  const createQueryString = () => {
    const params = new URLSearchParams(searchParams);
    params.set('view', viewType);

    return params.toString();
  };

  useEffect(() => {
    const queryString = createQueryString();
    router.push('?' + queryString);
  }, [viewType]);

  return (
    <ToggleGroup
      type='single'
      value={viewType}
      onValueChange={setViewType}
      className='m-0 flex h-6 items-center rounded-sm  border border-gray-200 bg-gray-100 p-0 text-xs shadow-sm dark:border-neutral-900 dark:bg-neutral-800 '
    >
      {toggleOptions.map((option) => (
        <ToggleGroupItem key={option} value={option} className={toggleClass}>
          {option.toLowerCase()}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default function TeamPage() {
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

  const getRoute = () => {
    return `/api/issues?q=${encodeURIComponent(
      JSON.stringify(issueQuery.q || {})
    )}`;
  };

  if (!team) return <></>;

  const issueView = (
    <ContentLoader
      route={getRoute()}
      childProps={{ query: issueQuery }}
      childDataProp='issues'
      syncChannels={[`team:${team.id}`]}
    >
      <IssueBoard />
    </ContentLoader>
  );

  const viewMap: { [key in viewTypes]: JSX.Element } = {
    ISSUES: issueView,
    PROJECTS: (
      <>
        <div className=' flex w-full  flex-col overflow-hidden pb-4   '>
          <div className='flex h-12 flex-row items-center justify-between border-y border-neutral-100 bg-white px-4  '>
            <div className='flex w-full flex-row items-center gap-2  '></div>
            <NewProject button={true} reload={reload} teamid={team.id} />
          </div>
          <ProjectsTableView projects={projects} />
        </div>
      </>
    ),
    TEAM: (
      <>
        <TeamMemberList teamid={params.teamid} reload={reload} />
      </>
    ),
  };

  return (
    <PageWrapper>
      <PageWrapper.Header>
        <div className='flex flex-row items-center'>
          <h1 className='h-full text-sm  font-medium leading-tight text-gray-700 dark:text-neutral-300'>
            {team.name}
          </h1>

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

      <PageWrapper.Content>{viewMap[viewType]}</PageWrapper.Content>
    </PageWrapper>
  );
}
