import { Metadata } from 'next';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signin } from '../actions';

export const metadata: Metadata = {
  title: 'Orbit',
  description: 'Project management app for teams',
};

export default function Error() {
  return (
    <div className='dark mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
      <div className='flex flex-col space-y-2 text-center'>
        <h1 className='text-3xl font-bold tracking-tight text-neutral-200'>
          Error
        </h1>
        <p className='text-muted-foreground text-sm'>
          Something went wrong. Please try again.
        </p>
        <Link href='/auth/signin' className='pt-10'>
          <Button className='w-24 '>Try again</Button>
        </Link>
      </div>
    </div>
  );
}
