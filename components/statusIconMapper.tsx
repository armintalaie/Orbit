import {
  Archive,
  CheckCircle2,
  CheckCircleIcon,
  Circle,
  CircleDashed,
  Inbox,
  InfoIcon,
  RefreshCcw,
  XCircle,
} from 'lucide-react';

export const statusIconMapper = (status: string, className: string) => {
  switch (status) {
    case 'Backlog':
      return <CircleDashed className={className} />;
    case 'Todo':
      return <Circle className={className} />;
    case 'In Progress':
      return <InfoIcon className={className} />;
    case 'Done':
      return <CheckCircle2 className={className} />;
    case 'Archive':
      return <Archive className={className} />;
    case 'Canceled':
      return <XCircle className={className} />;
    case 'Duplicate':
      return <XCircle className={className} />;
    case 'In Review':
      return <RefreshCcw className={className} />;
    default:
      return <InfoIcon className={className} />;
  }
};
