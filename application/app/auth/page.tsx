import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import AuthForm from '@/components/auth/authForm';

export const metadata: Metadata = {
  title: 'Orbit',
  description: 'Project management app for teams',
};

export default function AuthenticationPage() {
  return (
    <main className='flex h-screen flex-col items-center justify-center bg-gradient-to-tl   from-zinc-800 to-black text-white'>
      <div className=' container relative h-screen  w-full flex-col items-center justify-center sm:grid lg:max-w-none lg:px-0'>
        {/* <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'> */}
        {/* <div className='absolute inset-0 bg-zinc-900 bg-gradient-to-tl from-zinc-800 to-black' />
       
          
        </div> */}
        <div className='flex  h-full flex-col   justify-center  lg:p-8 '>
          <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
            <div className='flex flex-col space-y-2 text-center'>
              <h1 className='text-3xl font-bold tracking-tight text-neutral-200'>
                Sign into Orbit
              </h1>
              <p className='text-muted-foreground text-sm'>
                Use one of the following providers to sign in.
              </p>
            </div>
            <AuthForm />

            <p className='text-muted-foreground px-8 text-center text-sm'>
              By clicking continue, you agree to our{' '}
              <Link
                href='/terms'
                className='hover:text-primary pointer-events-none underline underline-offset-4'
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href='/privacy'
                className='hover:text-primary pointer-events-none underline underline-offset-4'
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
