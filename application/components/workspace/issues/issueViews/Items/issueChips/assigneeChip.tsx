import { Avatar, AvatarImage } from '@/components/ui/avatar';

type Assignee = {
  id: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    username: string;
    avatar: string;
    team_title: string;
  };
};

type AssigneeChipProps = {
  assignee: Assignee;
};

export default function AssigneeChip({ assignee }: { assignee: Assignee }) {
  return (
    <div className='flex items-center gap-1 overflow-hidden rounded-full border p-1 py-0.5 '>
      <Avatar className='flex h-5 w-5 items-center gap-1 border'>
        <AvatarImage src={assignee.profile.avatar} className='aspect-square' />
      </Avatar>
      <p className='pr-1 text-left text-[10px]'>{assignee.profile.firstName}</p>
    </div>
  );
}
