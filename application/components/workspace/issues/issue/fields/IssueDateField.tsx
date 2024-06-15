import { isOverdue, dateFormater } from '@/lib/util';
import React from 'react';
import { Badge } from '@/components/ui/badge';
interface IssueDeadlineFieldProps {
  issueId: number;
  date: string;
}

export function IssueDateField({ issueId, date }: IssueDeadlineFieldProps) {
  return isOverdue(date) ? (
    <Badge className='rounded-sm text-xs font-normal' color='red'>
      {dateFormater(date)}
    </Badge>
  ) : (
    <Badge className='rounded-sm text-xs font-normal' color='gray'>
      {dateFormater(date)}
    </Badge>
  );
}
