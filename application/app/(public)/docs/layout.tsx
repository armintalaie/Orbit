import Link from 'next/link';
import { getAllBlogPostMetadata } from './utils';
import { GithubIcon, GlobeIcon } from 'lucide-react';
import DocView from '@/components/docs/view';

export default function Layout({ children }) {
  const { posts, directories } = getAllBlogPostMetadata();

  return (
    <div className='dark flex h-screen max-h-screen flex-col overflow-hidden bg-neutral-950 text-white'>
      <nav className=' flex w-full items-center justify-between border-b p-2 px-4 text-center'>
        <div className='flex w-full items-center justify-between '>
          <Link href='/docs' className='pl-2 text-xl font-semibold'>
            Orbit Docs
          </Link>
          <div className='flex items-center gap-2'>
            <Link
              href='/'
              className='h-7 rounded-sm  border  p-1 text-sm text-teal-600 '
            >
              <GlobeIcon className='h-full w-fit' />
            </Link>
            <Link
              href='https://github.com/armintalaie/Orbit'
              className='h-7 rounded-sm  border p-1  text-sm text-teal-600 '
            >
              <GithubIcon className='h-full w-fit' />
            </Link>
          </div>
        </div>
      </nav>
      <DocView posts={posts} directories={directories}>
        {children}
      </DocView>
    </div>
  );
}
