import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import AuthForm from '@/components/auth/authForm';

export const metadata: Metadata = {
  title: 'Orbit',
  description: 'Authentication forms built using the components.',
};

export default function AuthenticationPage() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center '>
      <div className='md:hidden'>
       
      </div>
      <div className='container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
          <div className='absolute inset-0 bg-zinc-900' />
          <div className='relative z-20 flex items-center px-6 text-3xl font-bold '>
            🚀 Orbit
          </div>
        </div>
        <div className='lg:p-8 '>
          <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
            <div className='flex flex-col space-y-2 text-center'>
              <h1 className='text-2xl font-semibold tracking-tight'>
                Sign into Orbit
              </h1>
              <p className='text-sm text-muted-foreground'>
                Use one of the following providers to sign in.
              </p>
            </div>
            <AuthForm />

            {/* <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p> */}
          </div>
        </div>
      </div>
    </main>
  );
}
