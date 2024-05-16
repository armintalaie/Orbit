import { Metadata } from 'next';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signin } from '../actions';

export const metadata: Metadata = {
  title: 'Orbit',
  description: 'Project management app for teams',
};

export default function Signin() {
  return (
    <div className=' mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
      <div className='flex flex-col space-y-2 text-center'>
        <h1 className='text-3xl font-bold tracking-tight '>Sign into Orbit</h1>
        <p className='text-sm text-muted-foreground'>Use one of the following providers to sign in.</p>
      </div>

      <form className='flex flex-col space-y-2 text-sm'>
        <label htmlFor='email'>Email:</label>
        <Input id='email' name='email' type='email' required />
        <label htmlFor='password'>Password:</label>
        <Input id='password' name='password' type='password' required />
        <Button formAction={signin}>Sign in</Button>
      </form>

      <div className='flex flex-col space-y-2 text-center '>
        <p className='pointer-events-auto text-sm text-muted-foreground'>
          Don't have an account?{' '}
          <span className='text-primary underline underline-offset-4'>
            <Link href='/auth/signup' className='underline underline-offset-4 hover:text-primary'>
              Sign up
            </Link>
          </span>
        </p>
      </div>

      <p className='px-8 text-center text-sm text-muted-foreground'>
        You can later connect your account to other providers in the settings.
      </p>
    </div>
  );
}
