'use client';

import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import moment from 'moment';

export function DeadlineField({
  className,
  field,
  placeholder = 'select a date',
}: {
  className?: string;
  field: any;
  placeholder: string;
}) {
  const date = field.value ? moment(field.value, 'x').toDate() : undefined;
  const footer = (
    <div className='flex items-center justify-end'>
      <Button
        variant='ghost'
        onClick={() => {
          field.onChange(null);
        }}
      >
        Clear
      </Button>
      <Button
        variant='outline'
        onClick={() => {
          field.onChange(moment(date).valueOf().toString());
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
            variant={'ghost'}
            className={cn(
              ' text-2xs h-8 w-full justify-start text-left  font-normal ',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 h-3 w-3' />
            {date ? moment(date).format('YYYY-MM-DD') : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='flex w-auto flex-col p-1' align='start'>
          <Calendar
            // initialFocus
            mode='single'
            defaultMonth={date}
            selected={date}
            onSelect={(date) => {
              field.onChange(moment(date).valueOf().toString());
            }}
            numberOfMonths={2}
          />
          {footer}
        </PopoverContent>
      </Popover>
    </div>
  );
}
