import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Orbit',
  description: 'Project management app for teams',
};

export default function AuthenticationPage() {
  return (
    <main className='flex h-screen flex-col items-center justify-center bg-neutral-950 text-white'>
      <div className='  relative flex h-screen w-full  max-w-[1500px] justify-between overflow-hidden p-6'>
        <div className='flex max-w-md flex-1 flex-col gap-6 pt-40 text-center'>
          <h1 className='text-left text-5xl font-bold tracking-tight text-white'>
            Orbit
          </h1>
          <p className='text-left text-2xl'>
            A simple, intuitive, and delightful project management platform for
            all cases.
          </p>
          <Link
            href='/auth/'
            className='w-fit rounded bg-[#45ffa2] px-8 py-2 font-bold text-black'
          >
            Get Started
          </Link>
        </div>

        <div className='hidden flex-1 flex-col items-end py-10 text-center sm:hidden md:flex'>
          <div className='relative flex h-[740px] w-[740px] flex-col items-center justify-center rounded-full bg-[#111111] text-center'>
            <div className='absolute left-1/2 top-1/2 flex h-[600px] w-[600px] -translate-x-[calc(50%)] -translate-y-[calc(50%-1rem)] transform flex-col space-y-2 rounded-full  bg-[#151515] text-center'></div>
            <p className='-leading-2 z-10   max-w-lg text-4xl font-bold text-neutral-200'>
              Get things done with{' '}
              <span className='text-[#45ffa2] '>Orbit</span>
            </p>
          </div>
          {/* <div className='flex flex-col absolute space-y-2 text-center w-72 h-72 rounded-full bg-neutral-700'>
            </div> */}
        </div>
      </div>
    </main>
  );
}
