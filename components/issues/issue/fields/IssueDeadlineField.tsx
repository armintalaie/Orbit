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
import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';

type IssueDeadlineFieldProps = {
  issueId: number;
  contentOnly?: boolean;
  date?: DateRange;
};

export default function IssueDeadlineField({
  date: initialDate,
  issueId,
  contentOnly = false,
}: IssueDeadlineFieldProps) {
  const { fetcher } = useContext(OrbitContext);
  const [open, setOpen] = useState(false);

  const [date, setDate] = useState<DateRange>({
    from: initialDate?.from || undefined,
    to: initialDate?.to || undefined,
  });

  async function updateDate() {
    const res = await fetcher(`/api/issues/${issueId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deadline: date.from,
        datestarted: date.to,
      }),
    });

    if (!res.ok) throw new Error(res.statusText);
    toast('Deadlines updated');
  }

  const hasChanged = () => {
    return (
      date?.from?.toString() !== initialDate?.from?.toString() ||
      date?.to?.toString() !== initialDate?.to?.toString()
    );
  };
  const onOpenChange = (open: boolean) => {
    if (!open) {
      if (date && hasChanged()) {
        updateDate();
      } else {
        toast('No changes made');
      }
    }
    setOpen(open);
  };

  const IssueDeadlineSection = (
    <Calendar
      initialFocus
      mode='range'
      defaultMonth={date?.from}
      selected={date}
      onSelect={(date) => {
        setDate((prev) => ({
          ...prev,
          ...date,
        }));
      }}
      numberOfMonths={1}
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
              ' h-8 w-full justify-start p-0 text-left text-2xs text-xs',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0' side='right' align='start'>
          {IssueDeadlineSection}
        </PopoverContent>
      </Popover>
    </div>
  );
}
