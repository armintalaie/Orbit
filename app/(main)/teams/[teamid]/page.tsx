'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { dateFormater, isOverdue } from '@/lib/util';
import { TableIcon, BoxIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Badge, Button, Table } from '@radix-ui/themes';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
// import { NewProject } from '@/components/newProject';
import { useToast } from '@/components/ui/use-toast';
import { Dot, GanttChartSquare } from 'lucide-react';
import ProjectsTimelineView from '@/components/projects/projectsTimeline';
import PageWrapper from '@/components/layouts/pageWrapper';
import { NewProject } from '@/components/newProject';

export default function ProjectPage() {
  const params = useParams();
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [team, setTeam] = useState([]);
  const viewTypes = ['board', 'table', 'timeline'];
  const [viewType, setViewType] = useState(viewTypes[0]);

  async function fetchProjects() {
    const res = await fetch(`/api/teams/${params.teamid}/projects`, {
      next: {
        tags: ['projects'],
      },
    });
    const projects = await res.json();
    setProjects(projects);
  }

  async function fetchMembers() {
    const res = await fetch(`/api/teams/${params.teamid}/members`, {
      next: {
        tags: ['teams'],
      },
    });
    const members = await res.json();
    setMembers(members);
  }

  useEffect(() => {
    async function fetchTeam() {
      const res = await fetch(`/api/teams/${params.teamid}`, {
        next: {
          tags: ['teams'],
        },
      });
      const team = await res.json();
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

  return (
    <PageWrapper>
      <PageWrapper.Header>
        <div className='flex flex-row items-center'>
          <h1 className='text-md h-full  font-medium leading-tight text-gray-700'>
            {team.name}
          </h1>
          <p className='flex items-center text-xs  italic text-gray-600'>
            <Dot className='h-4 w-4' size={30} />
            {team.description}
          </p>
          <div className='flex items-center pl-2'>
            <TeamOptions teamId={team.id} />
          </div>
        </div>
        <div className='flex h-full items-center justify-center gap-2'>
          <NewProject button={true} reload={reload} teamid={team.id} />
        </div>
      </PageWrapper.Header>
      <PageWrapper.SubHeader>
        <div></div>
        <ToggleGroupDemo viewType={viewType} setViewType={setViewType} />
      </PageWrapper.SubHeader>

      <PageWrapper.Content>
        <div className=' flex w-full  flex-col overflow-hidden   '>
          {(() => {
            switch (viewType) {
              case 'table':
                return <ProjectsTableView projects={projects} />;
              case 'timeline':
                return <ProjectsTimelineView projects={projects} />;
              case 'board':
              default:
                return <ProjectsTableView projects={projects} />;
            }
          })()}
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
      </PageWrapper.Content>
    </PageWrapper>
  );
}

const ToggleGroupDemo = ({ viewType, setViewType }) => {
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

function TeamOptions({ teamId }: { teamId: string }) {
  const router = useRouter();
  async function deleteProject() {
    const res = await fetch(`/api/teams/${teamId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error(res.statusText);
    router.push('/teams');
  }

  async function archiveProject() {
    const res = await fetch(`/api/projects/${teamId}/archive`, {
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

function ProjectsTableView({ projects }) {
  return (
    <div className='flex  w-full flex-col overflow-hidden '>
      <Table.Root className='w-full  overflow-hidden rounded-sm border-gray-200 bg-white shadow-none'>
        <Table.Body>
          {projects.map((project) => (
            <Table.Row key={project.id}>
              <Table.RowHeaderCell>
                <Link
                  href={`/projects/${project.id}`}
                  shallow={true}
                  className='underline'
                >
                  {project.title}
                </Link>
              </Table.RowHeaderCell>
              <Table.Cell>{project.description}</Table.Cell>
              <Table.Cell>{project.status}</Table.Cell>
              <Table.Cell>
                {isOverdue(project.deadline) ? (
                  <Badge color='red'>{dateFormater(project.deadline)}</Badge>
                ) : (
                  <Badge color='gray'> {dateFormater(project.deadline)}</Badge>
                )}
              </Table.Cell>
              <Table.Cell>{project.dateCreated}</Table.Cell>
              <Table.Cell>{project.dateUpdated}</Table.Cell>
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
  const { toast } = useToast();

  function getInitials(name) {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('');
  }

  function getFirstNameAndLastInitial(name) {
    const [first, last] = name.split(' ');
    return `${first} ${last[0]}.`;
  }

  async function deleteMember() {
    const res = await fetch(`/api/teams/${teamid}/members/${member.memberid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error(res.statusText);
    toast({
      title: 'User Removed',
      description: `${member.profile.full_name} has been removed from the team`,
    });
    reload();
  }

  return (
    <ContextMenu key={member.memberid}>
      <ContextMenuTrigger>
        <div key={member.memberid} className='flex flex-col items-center gap-4'>
          <Avatar>
            <AvatarImage src={member.profile.avatar_url} />
            <AvatarFallback>
              {getInitials(member.profile.full_name)}
            </AvatarFallback>
          </Avatar>
          <p className='text-[10px]'>
            {getFirstNameAndLastInitial(member.profile.full_name)}
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
