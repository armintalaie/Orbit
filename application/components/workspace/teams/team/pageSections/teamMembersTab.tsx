import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { UserFinder } from '@/components/workspace/util/userFinder';
import AddMember from '@/components/workspace/teams/team/members/addMember';
import { useContext } from 'react';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';

export function MemberCard(props: { member: any }) {
  return (
    <div className='flex flex-row items-center gap-4 text-2xs'>
      <span className='w-8 flex-shrink-0 truncate'>
        <Image src={props.member.profile.avatar} alt='avatar' width={24} height={24} className='rounded-full' />
      </span>
      <div className='flex flex-col'>
        <p className='font-medium'>
          {props.member.profile.firstName} {props.member.profile.lastName}
        </p>
        <p className='text-gray-500'>{props.member.email}</p>
      </div>
    </div>
  );
}

export default function TeamMembersTab({ team }: { team: any }) {
  const { members: teamMembers } = team;
  return (
    <div className='flex flex-col gap-4 p-1 px-4'>
      <div className='flex flex-row items-center justify-between'>
        <h1 className='text-md medium'>Members</h1>
        <AddMember team={team} />
      </div>
      <div className='flex flex-col gap-4'>
        {teamMembers.map((member: any) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
