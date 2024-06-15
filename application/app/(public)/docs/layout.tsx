import Link from 'next/link';
import { getAllBlogPostMetadata } from './utils';
import { GithubIcon, GlobeIcon } from 'lucide-react';
import DocView from '@/components/docs/view';

export default function Layout({ children }) {
  const { posts, directories } = getAllBlogPostMetadata();

  return (
    <div className=' primary-surface flex h-screen max-h-screen flex-col overflow-hidden'>
      <nav className=' flex w-full items-center justify-between border-b p-2 px-4 text-center'>
        <div className='flex w-full items-center justify-between '>
          <Link href='/docs' className='pl-2 text-xl font-semibold'>
            Orbit Docs
          </Link>
          <div className='flex items-center gap-2'>
            <Link href='/' className='h-8 rounded-md  border p-2  text-sm '>
              <GlobeIcon className='h-full w-fit' />
            </Link>
            <Link href='https://github.com/armintalaie/Orbit' className='h-8 rounded-md  border p-2  text-sm  '>
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
