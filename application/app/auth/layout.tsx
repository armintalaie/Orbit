import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orbit',
  description: 'Project management app for teams',
};

export default function Layout({ children }) {
  return (
    <main className='flex h-screen flex-col items-center justify-center bg-neutral-950 text-white'>
      <div className=' container relative h-screen  w-full flex-col items-center justify-center sm:grid lg:max-w-none lg:px-0'>
        <div className='flex  h-full flex-col   justify-center  lg:p-8 '>
          <div className='flex w-full max-w-xl  flex-col space-y-2 rounded-3xl bg-gradient-to-r from-teal-900 to-teal-800 p-3'>
            <div className='flex w-full max-w-xl  flex-col space-y-2 rounded-2xl bg-neutral-900 p-10'>
              {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
