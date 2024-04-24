'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function DeadlineField({
  className,
  field,
}: {
  className?: string;
  field: any;
}) {
  const [date, setDate] = React.useState<Date | undefined>(field.value);

  const footer = (
    <div className='flex items-center justify-between'>
      <Button
        variant='ghost'
        onClick={() => {
          setDate(undefined);
          field.onChange(undefined);
        }}
      >
        Clear
      </Button>
      <Button
        variant='ghost'
        onClick={() => {
          setDate(new Date());
          field.onChange(new Date());
        }}
      >
        Today
      </Button>
    </div>
  );
  return (
    <div className={cn('grid items-center', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'outline'}
            className={cn(
              ' text-2xs h-8 w-full justify-start text-left text-xs font-normal ',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {date ? <>{format(date, 'LLL dd, y')}</> : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            initialFocus
            mode='single'
            defaultMonth={date}
            selected={date}
            onSelect={(date) => {
              setDate(date);
              field.onChange(date);
            }}
            footer={footer}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
