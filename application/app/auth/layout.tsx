import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Orbit',
  description: 'Project management app for teams',
};

export default function Layout({ children }) {
  return (
    <main className='primary-surface flex h-screen flex-col items-center justify-center '>
      <nav className='secondary-surface flex w-full justify-between border-b p-4'>
        <Link href='/'>
          <h1 className='text-2xl font-bold'>Orbit</h1>
        </Link>
      </nav>
      <div className=' container relative h-screen  w-full flex-col items-center justify-center px-1 sm:grid lg:max-w-none lg:px-0'>
        <div className='flex  h-full flex-col   justify-center  sm:p-1 lg:p-8 '>
          <div className='flex w-full max-w-xl  flex-col space-y-2 rounded-[30px] bg-gradient-to-r from-teal-950 to-teal-900 p-5 shadow-2xl'>
            <div className='flex w-full max-w-xl  flex-col space-y-2 rounded-3xl bg-gradient-to-r from-teal-900 to-teal-800 p-5 shadow-2xl'>
              <div className='secondary-surface flex w-full  max-w-xl flex-col space-y-2 rounded-2xl p-10 shadow-lg'>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
