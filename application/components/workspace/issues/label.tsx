import { TagIcon } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { ILabel } from '@/lib/types/issue';

function getTextColor(color: string) {
  const hex = color.replace('#', '');
  const c_r = parseInt(hex.substr(0, 2), 16);
  const c_g = parseInt(hex.substr(2, 2), 16);
  const c_b = parseInt(hex.substr(4, 2), 16);
  const brightness = (c_r * 299 + c_g * 587 + c_b * 114) / 1000;
  return brightness > 155 ? '#000000' : '#ffffff';
}

export default function IssueLabel({
  label,
  id,
  color,
  compact = false,
  className = '',
  style,
}: {
  label: string;
  id: number;
  color: string;
  compact?: boolean;
  className?: string;
  style?: object;
}) {
  const textColor = getTextColor(color);

  if (compact)
    return (
      <div
        id={id.toString()}
        className={`flex w-fit flex-row items-center gap-2 rounded-full  p-1 ${className} `}
        style={
          style
            ? style
            : {
                backgroundColor: `${color}`,
                color: `${textColor}`,
              }
        }
      >
        <TagIcon className='h-3 w-3' />
      </div>
    );

  return (
    <div
      id={id.toString()}
      className={`flex w-fit flex-row items-center gap-2 rounded-md  p-1 px-2 ${className} `}
      style={
        style
          ? style
          : {
              backgroundColor: `${color}`,
              color: `${textColor}`,
            }
      }
    >
      <TagIcon className='h-3 w-3' />
      <p className='items-center  text-2xs font-medium leading-tight '>{label}</p>
    </div>
  );
}

export function LabelList({ labels }: { labels: ILabel[] }) {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <div className='flex flex-row items-center gap-1'>
          {labels.map((label, index) => (
            <div className={`relative ${index !== 0 ? '-ml-2' : ''}`} key={label.id}>
              <IssueLabel key={label.id} label={label.label} id={label.id} color={label.color} compact={true} />
            </div>
          ))}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className='w-fit max-w-sm bg-neutral-100 p-1'>
        <div className='flex flex-row flex-wrap gap-2 p-0'>
          {labels.map((label) => (
            <IssueLabel key={label.id} label={label.label} id={label.id} color={label.color} />
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
