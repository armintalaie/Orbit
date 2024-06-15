import { NewIssue } from '../newIssue';
import IssueItem from './Items/IssueListItem';

export default function ListView({
  issues,
  error,
  loading,
  changeQuery,
  params,
}: {
  issues: any[];
  error: any;
  loading: boolean;
  changeQuery: any;
  params: any;
}) {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center  '>
      <div className='flex h-full w-full flex-col '>
        <div className='primary-surface flex w-full flex-grow flex-col  divide-y-0  overflow-y-scroll rounded-sm  shadow-none'>
          {issues.map((grouping: any) => (
            <div className='flex w-full flex-col border-b  '>
              <div className='secondary-surface flex w-full border-b  '>
                <div className='flex w-full items-center justify-between gap-3 px-3 py-2'>
                  <div className='flex items-center gap-3'>
                    <div className='text-xs font-semibold '>{grouping.label}</div>
                  </div>
                  <NewIssue button={false} defaultValues={{ projects: [params.pid] }} />
                </div>
              </div>

              <ul className='flex flex-col divide-y'>
                {grouping.issues &&
                  grouping.issues.map((issue: any) => (
                    <li key={issue.id} className=''>
                      <IssueItem issue={issue} />
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
