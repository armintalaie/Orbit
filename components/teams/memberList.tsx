import { useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { NewTeamMember } from '../newTeamMember';
import { OrbitContext } from '@/lib/context/OrbitContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '../ui/context-menu';

export default function TeamMemberList({
  teamid,
  reload,
}: {
  teamid: number | string;
  reload: Function;
}) {
  const [members, setMembers] = useState([]);
  const { fetcher } = useContext(OrbitContext);

  async function fetchMembers() {
    const res = await fetcher(`/api/teams/${teamid}/members`, {
      next: { revalidate: 100 },
      headers: {
        'cache-control': 'max-age=3600',
      },
      cache: 'default',
    });
    const members = await res.json();
    setMembers(members);
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className=' flex w-full  flex-col px-4'>
      <div className='flex flex-row items-center justify-between  '>
        <h2 className='text-md  py-3 font-medium leading-tight text-gray-700 dark:text-neutral-300'>
          Members
        </h2>
        <NewTeamMember teamid={teamid} reload={fetchMembers} button={true} />
      </div>

      <MembersList members={members} teamid={teamid} reload={reload} />
    </div>
  );
}

function MembersList({ members, teamid, reload }) {
  return (
    <div className='flex w-full   flex-row flex-wrap gap-4 px-2 py-4'>
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
          <button onClick={() => deleteMember()} className='text-xs'>
            Remove from team
          </button>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
