import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { OrbitContext } from '@/lib/context/OrbitContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useContext, useState } from 'react';
import { toast } from 'sonner';

type IssueDeadlineFieldProps = {
  issueId: number;
  reload?: () => void;
  contentOnly?: boolean;
  date?: Date;
};

export default function IssueDeadlineField({
  date: initialDate,
  issueId,
  contentOnly = false,
  reload,
}: IssueDeadlineFieldProps) {
  const { fetcher } = useContext(OrbitContext);
  const [open, setOpen] = useState(false);

  const [date, setDate] = useState<Date | undefined>(initialDate);

  async function updateDate() {
    const res = await fetcher(`/api/issues/${issueId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deadline: date ? date.toISOString().split('T')[0] : null,
      }),
    });
    reload && reload();

    if (!res.ok) throw new Error(res.statusText);
    toast('Deadline updated');
  }

  const hasChanged = () => {
    return date?.toString() !== initialDate?.toString();
  };
  const onOpenChange = (open: boolean) => {
    if (!open) {
      if (hasChanged()) {
        updateDate();
      } else {
        toast('No changes made');
      }
    }
    setOpen(open);
  };

  const footer = (
    <div className='flex items-center justify-between'>
      <Button
        variant='ghost'
        onClick={() => {
          setDate(undefined);
        }}
      >
        Clear
      </Button>
      <Button
        variant='ghost'
        onClick={() => {
          setDate(new Date());
        }}
      >
        Today
      </Button>
    </div>
  );

  const IssueDeadlineSection = (
    <Calendar
      initialFocus
      defaultMonth={date}
      mode='single'
      selected={date ? date : undefined}
      onSelect={setDate}
      numberOfMonths={1}
      footer={footer}
    />
  );

  if (contentOnly) {
    return IssueDeadlineSection;
  }

  return (
    <div className='flex items-center space-x-4'>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'ghost'}
            className={cn(
              ' h-8 w-full justify-start p-0 text-left text-2xs ',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {date ? <>{format(date, 'LLL dd, y')}</> : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0' side='right' align='start'>
          {IssueDeadlineSection}
        </PopoverContent>
      </Popover>
    </div>
  );
}
