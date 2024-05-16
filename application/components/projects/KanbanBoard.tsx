'use client';

import { NewIssue } from '@/components/newIssue';
import { CardHeader, CardContent } from '@/components/ui/card';
import IssueCard from './IssueCard';
import { IIssue } from '@/lib/types/issue';
import { motion } from 'framer-motion';

export interface KanbanViewProps {
  groupedIssues: any;
  projectId?: number;
  onIssueUpdate: (issue: IIssue) => void;
}

export default function KanbanView({ groupedIssues, projectId }: KanbanViewProps) {
  if (!groupedIssues || !groupedIssues.issues) return <></>;

  return (
    <div className='flex h-full w-full flex-1 flex-row gap-12  overflow-hidden  overflow-x-scroll p-2 py-0'>
      <div className='flex h-full flex-grow  gap-4 '>
        {groupedIssues.issues.map((grouping: any) => (
          <IssueColumn key={grouping.key} grouping={grouping} projectId={projectId} groupedIssues={groupedIssues} />
        ))}
      </div>
    </div>
  );
}

function IssueColumn({ grouping, projectId, groupedIssues }) {
  return (
    <div key={grouping.key} className='flex h-full   flex-col  overflow-hidden'>
      <div key={grouping.label} className='relative flex  h-full w-72 flex-col  rounded-sm p-0'>
        <CardHeader className='m-0 flex flex-row items-center justify-between space-y-0 px-1'>
          <div className='m-0 flex flex-row items-center gap-2'>
            <p className='flex items-center text-xs text-gray-700 dark:text-gray-200'>
              {grouping.label}
              <span className='ml-2 flex h-5 w-5 items-center justify-center rounded-full p-1 text-xs text-gray-400 dark:bg-neutral-800 dark:text-neutral-400'>
                {grouping.issues.length}
              </span>
            </p>
          </div>

          <NewIssue
            button={false}
            defaultValues={{
              projectid: projectId,
              [groupedIssues.key]: grouping.key,
            }}
          />
        </CardHeader>
        <CardContent className='z-20 flex  flex-grow flex-col overflow-x-visible overflow-y-scroll  p-0  '>
          <motion.ul className='flex flex-grow flex-col space-y-3  pb-3 '>
            {grouping.issues &&
              grouping.issues.map((issue: IIssue, idx: number) => (
                <motion.div
                  key={issue.id}
                  layout={true}
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                    transition: {
                      duration: 0.5,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    transition: {
                      duration: 0.5,
                    },
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 10,
                  }} // Customize the transition
                >
                  <IssueCard issue={issue} />
                </motion.div>
              ))}
          </motion.ul>
        </CardContent>
      </div>
    </div>
  );
}
