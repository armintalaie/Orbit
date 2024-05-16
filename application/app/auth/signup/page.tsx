import { Metadata } from 'next';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signup } from '../actions';

export const metadata: Metadata = {
  title: 'Orbit',
  description: 'Project management app for teams',
};

export default function Signup() {
  return (
    <div className=' mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
      <div className='flex flex-col space-y-2 text-center'>
        <h1 className='text-3xl font-bold tracking-tight '>Start using Orbit</h1>
        <p className='text-sm text-muted-foreground'>Sign up to start managing your projects.</p>
      </div>

      <form className='flex flex-col space-y-2 text-sm'>
        <label htmlFor='email'>Email:</label>
        <Input id='email' name='email' type='email' required />
        <label htmlFor='password'>Password:</label>
        <Input id='password' name='password' type='password' required />
        <Button formAction={signup}>Sign up</Button>
      </form>

      <div className='flex flex-col space-y-2 text-center '>
        <p className='pointer-events-auto text-sm text-muted-foreground'>
          Already have an account?{' '}
          <span className='text-primary underline underline-offset-4'>
            <Link href='/auth/signin' className='underline underline-offset-4 hover:text-primary'>
              Sign in
            </Link>
          </span>
        </p>
      </div>

      <p className='px-8 text-center text-sm text-muted-foreground'>
        By clicking continue, you agree to our{' '}
        <Link href='/terms' className='pointer-events-none underline underline-offset-4 hover:text-primary'>
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href='/privacy' className='pointer-events-none underline underline-offset-4 hover:text-primary'>
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
