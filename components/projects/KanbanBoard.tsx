'use client';

import { NewIssue } from '@/components/newIssue';
import { CardHeader, CardContent } from '@/components/ui/card';
import IssueCard from './IssueCard';
import { IIssue } from '@/lib/types/issue';

export interface KanbanViewProps {
  groupedIssues: any;
  reload: (issue?: IIssue) => void;
  projectId?: number;
  onIssueUpdate: (issue: IIssue) => void;
}

export default function KanbanView({
  groupedIssues,
  reload,
  projectId,
  onIssueUpdate,
}: KanbanViewProps) {
  if (!groupedIssues) return <></>;

  const nonEmptyGroups = groupedIssues.issues.filter(
    (gp: any) => gp.issues.length > 0
  );
  const emptyGroups = groupedIssues.issues.filter(
    (gp: any) => gp.issues.length === 0
  );
  return (
    <div className='flex h-full w-full flex-1 flex-row gap-12  overflow-hidden  overflow-x-scroll p-2 py-0'>
      <div className='flex h-full flex-grow  gap-4 '>
        {nonEmptyGroups.map((grouping: any) => (
          <div
            key={grouping.key}
            className='flex h-full   flex-col  overflow-hidden'
          >
            <div
              key={grouping.label}
              className='flex h-full  w-72 flex-col rounded-sm  p-0 '
            >
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
                  reload={reload}
                  onIssueUpdate={onIssueUpdate}
                  defaultValues={{
                    projectid: projectId,
                    [groupedIssues.key]: grouping.key,
                  }}
                />
              </CardHeader>
              <CardContent className='flex flex-grow  flex-col overflow-x-visible overflow-y-scroll p-0   '>
                <ul className='flex flex-grow flex-col space-y-3  pb-3 '>
                  {grouping.issues &&
                    grouping.issues.map((issue: IIssue, idx: number) => (
                      <div key={issue.id}>
                        <IssueCard issue={issue} reload={reload} />
                      </div>
                    ))}
                </ul>
              </CardContent>
            </div>
          </div>
        ))}
      </div>

      <div className='flex flex-col py-5'>
        <div className='h-full w-72 rounded-sm p-0 '>
          <div className='flex h-full flex-col items-center gap-3 pt-1'>
            {emptyGroups.map((grouping: any) => (
              <div key={grouping.key}>
                <div className=' w-72 rounded-sm p-0 '>
                  <div className='flex flex-row items-center justify-between  rounded-md bg-white px-2 py-3 shadow-sm dark:bg-neutral-800'>
                    <div className='flex flex-row items-center gap-2 '>
                      <p className='text-xs text-gray-700 dark:text-gray-200 '>
                        {grouping.label}
                        <span className='ml-2 text-xs text-gray-400'>
                          {grouping.issues.length}
                        </span>
                      </p>
                    </div>

                    <NewIssue
                      button={false}
                      reload={reload}
                      onIssueUpdate={onIssueUpdate}
                      defaultValues={{
                        projectid: projectId,
                        [groupedIssues.key]: grouping.key,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
