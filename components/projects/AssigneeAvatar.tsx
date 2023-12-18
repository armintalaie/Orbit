import { getInitials, getFirstNameAndLastInitial } from '@/lib/util';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

type AssigneeAvatarProps = {
  assignee: {
    profile: {
      id: string;

      full_name: string;
      avatar_url: string;
    };
  };
};

export default function AssigneeAvatar({ assignee }: AssigneeAvatarProps) {
  return (
    <div
      key={assignee.profile.id}
      className='flex  items-center gap-1  overflow-hidden'
    >
      <p className='text-[11px]'>
        {getFirstNameAndLastInitial(assignee.profile.full_name)}
      </p>
      <Avatar className='flex  h-5 w-5 items-center gap-4 '>
        <AvatarImage
          src={assignee.profile.avatar_url}
          className='aspect-square '
        />
        <AvatarFallback>
          {getInitials(assignee.profile.full_name)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
