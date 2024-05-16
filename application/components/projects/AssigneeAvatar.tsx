import { getInitials, getFirstNameAndLastInitial } from '@/lib/util';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { CircleUser } from 'lucide-react';

type AssigneeAvatarProps = {
  assignee?: {
    id: string;
    full_name: string;
    avatar_url: string;
    email?: string;
  };
  formatting?: {
    showFullName: boolean;
    showEmail: boolean;
    leftAlign: boolean;
  };
};

export default function AssigneeAvatar({ assignee, formatting }: AssigneeAvatarProps) {
  const avatarFormatting = {
    showFullName: false,
    showEmail: false,
    leftAlign: true,
    ...formatting,
  };

  if (!assignee) {
    return (
      <div className={`flex  items-center gap-1  overflow-hidden`}>
        <p className='text-[10px]'></p>
        <Avatar className='flex  h-5 w-5 items-center gap-4 '>
          <CircleUser className='h-5 w-5 stroke-2 opacity-50' />
        </Avatar>
      </div>
    );
  }
  return (
    <div
      key={assignee.id}
      className={`flex  items-center gap-2  overflow-hidden`}
      style={{
        width: '100%',
        flexDirection: avatarFormatting.leftAlign ? 'row-reverse' : 'row',
      }}
    >
      <Avatar className='flex  h-5 w-5 items-center gap-4 '>
        <AvatarImage src={assignee.avatar_url} className='aspect-square ' />
        <AvatarFallback>{getInitials(assignee.full_name)}</AvatarFallback>
      </Avatar>
      <p className='text-[10px]'>
        {avatarFormatting.showFullName ? assignee.full_name : getFirstNameAndLastInitial(assignee.full_name)}
      </p>
      {avatarFormatting.showEmail && assignee.email && <p className='text-[8px]'>{'<' + assignee.email + '>'}</p>}
    </div>
  );
}
