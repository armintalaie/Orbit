import { IIssue } from '@/lib/types/issue';
import { IssueStatusInput } from './standaloneFields/IssueStatusField';
import { IssueTargetDateInput } from '@/components/workspace/issues/issue/standaloneFields/IssueTargetDateField';

export default function IssueProperties({ refIssue }: { refIssue: IIssue }) {
  return (
    <div className='flex  flex-col  p-2 px-4'>
      <IssueStatusInput issueId={refIssue.id.toString()} defaultValue={refIssue.status.id.toString()} />
      <IssueTargetDateInput issueId={refIssue.id} defaultValue={refIssue.targetDate} />
    </div>
  );
}
