import { IIssue } from '@/lib/types/issue';
import { GitBranchIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import IssueProperties from '../issueProperties';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { useContext } from 'react';

export function IssueInfo({ refIssue }: { issueId: number; refIssue: IIssue }) {
  const { currentWorkspace } = useContext(OrbitContext);

  return (
    <div className=' primary-surface flex h-full w-full flex-col  border-l '>
      <div className='flex h-12 w-full items-center justify-end gap-6   p-4  px-4  '>
        <Button
          variant='ghost'
          className='p-0 hover:bg-inherit'
          onClick={() => {
            navigator.clipboard.writeText(`P${currentWorkspace}-issue${refIssue.id}`).then(
              () => {
                toast('Copied to clipboard');
              },
              () => {
                toast('Failed to copy to clipboard');
              }
            );
          }}
        >
          <GitBranchIcon className='h-4 w-4' />
        </Button>
      </div>
      <div className='flex flex-grow flex-col justify-start gap-3 divide-y  border-t  py-3  '>
        <IssueProperties refIssue={refIssue} />
        <div className='flex  flex-col  gap-4   p-4 py-3'></div>
      </div>
    </div>
  );
}
