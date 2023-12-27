'use client'; // top to the file

import { BugIcon, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';

export function Changelog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='flex h-8 w-full items-center rounded-sm border border-gray-200 bg-white p-1 px-2 text-left text-xs text-gray-500 shadow-sm dark:border-neutral-800 dark:bg-neutral-800'>
          <QuestionMarkCircledIcon className=' h-3 w-3' />
        </button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Changelog</DialogTitle>
          <DialogDescription>
            View the latest changes to Orbit.
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-center space-x-2'>
          <div className='grid flex-1 gap-2'>
            <Label htmlFor='link' className='sr-only'>
              Link
            </Label>
            <Input
              id='link'
              defaultValue='https://github.com/armintalaie/Orbit/blob/main/CHANGELOG.md'
              readOnly
            />
          </div>
          <Button type='submit' size='sm' className='px-3'>
            <span className='sr-only'>Copy</span>
            <Copy className='h-4 w-4' />
          </Button>
        </div>
        <DialogFooter className='sm:justify-start'>
          <DialogClose asChild>
            {/* <Button type='button' variant='secondary'>
              Close
            </Button> */}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
