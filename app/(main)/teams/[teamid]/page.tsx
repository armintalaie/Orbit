'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { dateFormater, isOverdue, setDocumentMeta } from '@/lib/util';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Badge, Button, Table } from '@radix-ui/themes';
import { useParams, useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NewTeamMember } from '@/components/newTeamMember';
import PageWrapper from '@/components/layouts/pageWrapper';
import { NewProject } from '@/components/projects/newProject';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import IssueBoard from '@/components/projects/IssueMainBoard';
import { toast } from 'sonner';
import { Maximize2 } from 'lucide-react';
import { OrbitContext } from '@/lib/context/OrbitContext';
import { IProject } from '@/lib/types/issue';

type viewTypes = 'ISSUES' | 'PROJECTS';

export default function ProjectPage() {
  const { fetcher } = useContext(OrbitContext);
  const params = useParams();
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [team, setTeam] = useState([]);
  const [viewType, setViewType] = useState<viewTypes>('ISSUES');
  const issueQuery = {
    tid: params.teamid,
    q: {
      teams: [params.teamid as string],
    },
    showProject: true,
  };

  async function fetchProjects() {
    const q = {
      teams: [params.teamid as string],
    };
    const res = await fetcher(
      `/api/projects?q=${encodeURIComponent(JSON.stringify(q))}`,
      {
        next: {
          tags: ['projects'],
        },
      }
    );

    const projects = await res.json();
    setProjects(projects);
  }

  async function fetchMembers() {
    const res = await fetcher(`/api/teams/${params.teamid}/members`, {
      next: {
        tags: ['teams'],
      },
    });
    const members = await res.json();
    setMembers(members);
  }

  useEffect(() => {
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
    fetchTeam();
    fetchProjects();
    fetchMembers();
  }, []);

  async function reload() {
    fetchProjects();
    fetchMembers();
  }

  const issueView = <IssueBoard query={issueQuery} />;

  return (
    <PageWrapper>
      <PageWrapper.Header>
        <div className='flex flex-row items-center'>
          <h1 className='text-md h-full  font-medium leading-tight text-gray-700'>
            {team.name}
          </h1>
          <p className=' hidden flex-row items-center px-3 text-xs lg:flex'>
            {team.description}
          </p>
          <div className='flex items-center pl-2'>
            <TeamOptions teamId={team.id} />
          </div>
        </div>
        <div className='flex h-full items-center justify-center gap-2'></div>
      </PageWrapper.Header>
      <PageWrapper.SubHeader>
        <div className='flex w-full flex-row items-center justify-between gap-2'>
          <div className='h-full pr-2 text-xs font-medium leading-tight text-gray-700'></div>

          <ToggleTeamViewContents
            viewType={viewType}
            setViewType={setViewType}
          />
        </div>
      </PageWrapper.SubHeader>

      <PageWrapper.Content>
        {viewType === 'ISSUES' ? (
          issueView
        ) : (
          <>
            <div className=' flex w-full  flex-col overflow-hidden pb-4   '>
              <div className='flex flex-row items-center justify-between px-4  '>
                <h2 className='text-md  py-3 font-medium leading-tight text-gray-700'>
                  Projects
                </h2>
                <NewProject button={true} reload={reload} teamid={team.id} />
              </div>

              <ProjectsTableView projects={projects} />
            </div>

            <div className=' flex w-full  flex-col px-4'>
              <div className='flex flex-row items-center justify-between  '>
                <h2 className='text-md  py-3 font-medium leading-tight text-gray-700'>
                  Members
                </h2>
                <NewTeamMember
                  teamid={params.teamid}
                  reload={fetchMembers}
                  button={true}
                />
              </div>

              <MembersList
                members={members}
                teamid={params.teamid}
                reload={reload}
              />
            </div>
          </>
        )}

        {/* <Analytics/> */}
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
      className='m-0 flex h-6 items-center rounded-sm  border border-gray-200 bg-gray-100 p-0 text-xs shadow-sm'
    >
      <ToggleGroupItem
        className='m-0 flex h-full items-center gap-2 rounded-sm border-dashed p-1 px-2 text-xs text-gray-700 data-[state=on]:bg-white data-[state=on]:text-gray-700   '
        value='ISSUES'
      >
        Issues
      </ToggleGroupItem>
      <ToggleGroupItem
        className='m-0 flex h-full items-center gap-2  rounded-sm border-dashed p-1 px-2 text-xs  text-gray-700 data-[state=on]:bg-white data-[state=on]:text-gray-700'
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
      <Table.Root className='w-full  overflow-hidden  border-gray-200 bg-white shadow-none'>
        <Table.Body>
          <Table.Row>
            <Table.RowHeaderCell>Title</Table.RowHeaderCell>
            <Table.RowHeaderCell className='hidden lg:table-cell'>
              Description
            </Table.RowHeaderCell>

            <Table.RowHeaderCell>Deadline</Table.RowHeaderCell>
          </Table.Row>
          {projects.map((project: IProject) => (
            <Table.Row key={project.id}>
              <Table.RowHeaderCell className='flex flex-row items-center gap-4'>
                <Link
                  href={`/projects/${project.id}`}
                  shallow={true}
                  className='underline'
                >
                  <Maximize2 className='h-3 w-3' />
                </Link>
                {project.title}
              </Table.RowHeaderCell>

              <Table.Cell className='hidden lg:table-cell'>
                {project.description}
              </Table.Cell>

              <Table.Cell>
                {isOverdue(project.deadline) ? (
                  <Badge color='red'>{dateFormater(project.deadline)}</Badge>
                ) : (
                  <Badge color='gray'> {dateFormater(project.deadline)}</Badge>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}

function MembersList({ members, teamid, reload }) {
  return (
    <div className='flex flex-row items-center  gap-4 px-2 py-4'>
      {members.map((member) => (
        <MemberAvatar
          key={member.memberid}
          member={member}
          teamid={teamid}
          reload={reload}
        />
      ))}
    </div>
  );
}

function MemberAvatar({ member, teamid, reload }) {
  function getInitials(name: string) {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('');
  }

  function getFirstNameAndLastInitial(name: string) {
    const [first, last] = name.split(' ');
    return `${first} ${last[0]}.`;
  }

  function deleteMember() {
    const operation = setTimeout(async () => {
      const res = await fetch(
        `/api/teams/${teamid}/members/${member.memberid}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }, 4000);

    toast('User Removed from team', {
      duration: 3000,
      action: {
        label: 'Undo',
        onClick: () => clearTimeout(operation),
      },
      description: `${member.full_name} has been removed from the team`,
    });
    reload();
  }

  return (
    <ContextMenu key={member.memberid}>
      <ContextMenuTrigger>
        <div key={member.memberid} className='flex flex-col items-center gap-4'>
          <Avatar>
            <AvatarImage src={member.avatar_url} />
            <AvatarFallback>{getInitials(member.full_name)}</AvatarFallback>
          </Avatar>
          <p className='text-[10px]'>
            {getFirstNameAndLastInitial(member.full_name)}
          </p>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <button onClick={() => deleteMember()}>Remove from team</button>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
