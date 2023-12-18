'use client';

import { dateFormater, isOverdue } from '@/lib/util';
import { Badge, Box, Text } from '@radix-ui/themes';
import Link from 'next/link';

export interface IssueCardProps {
  issue: {
    id: number;
    title: string;
    deadline: string;
    priority: number;
    projectid: number;
    statusid: number;
  };
}

export default function IssueCard({ issue }: IssueCardProps) {
  return (
    <Link
      href={`/projects/${issue.projectid}/issues/${issue.id}`}
      aria-disabled={true}
    >
      <Box className='flex flex-col gap-2 rounded-sm border border-gray-100 bg-white  p-2 '>
        <div className='flex w-full flex-row justify-between gap-2 py-0'>
          <Text size='1' className='text-gray-600'>
            #{issue.id}
          </Text>
          {issue.priority != 0 && (
            <Badge color='gray'>{'!'.repeat(issue.priority)}</Badge>
          )}
        </div>
        <Text size='2' className='pb-2 font-medium  text-gray-800'>
          {issue.title}
        </Text>

        <div className='flex w-full flex-row justify-between gap-2'>
          <Text size='1' className='font-semibold text-gray-500 '>
            No assignee
          </Text>
          {isOverdue(issue.deadline) ? (
            <Badge color='red'>{dateFormater(issue.deadline)}</Badge>
          ) : (
            <Badge color='gray'> {dateFormater(issue.deadline)}</Badge>
          )}
        </div>
      </Box>
    </Link>
  );
}
