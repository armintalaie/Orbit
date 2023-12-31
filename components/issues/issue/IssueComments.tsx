import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ConstructionIcon } from 'lucide-react';

export function IssueComments({ issueId }: { issueId: number }) {
  return (
    <div className='flex h-full w-full flex-col items-center  gap-2 border-t border-gray-100 py-2'>
      <div className='flex w-full flex-row items-center gap-2'>
        <h1 className='text-md  px-4  py-2 font-medium leading-tight text-gray-700'>
          Comments
        </h1>
      </div>
      <div className='flex flex-col items-center justify-center gap-2 pb-4'>
        <Alert>
          <ConstructionIcon className='h-4 w-4' />
          <AlertTitle>In progress</AlertTitle>
          <AlertDescription>
            This is a work in progress, please check back later.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
