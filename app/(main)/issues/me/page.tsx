import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ConstructionIcon } from 'lucide-react';

export default function MyIssuePage() {
  return (
    <div className='flex flex-col items-center justify-center gap-2 pb-4'>
      <Alert>
        <ConstructionIcon className='h-4 w-4' />
        <AlertTitle>In progress</AlertTitle>
        <AlertDescription>
          This is a work in progress, please check back later.
        </AlertDescription>
      </Alert>
    </div>
  );
}
