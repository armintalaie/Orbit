import Link from 'next/link';
import { getAllBlogPostMetadata } from './utils';
import { GithubIcon, GlobeIcon } from 'lucide-react';

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
      <section className='flex flex-1 overflow-y-hidden p-4'>
        <aside className=' w-72 overflow-y-scroll text-sm text-white'>
          <SideBarNav posts={posts} directories={directories} />
        </aside>
        <div className='flex h-full flex-1 justify-center overflow-y-hidden '>
          {children}
        </div>
      </section>
    </div>
  );
}

function SideBarNav({ posts, directories }) {
  return (
    <>
      {posts.map((post) => {
        return (
          <div>
            <a
              className='line-clamp-1 block truncate p-1 pr-0 hover:text-blue-500'
              href={`/docs/${post.slug}`}
            >
              {post.metadata.title}
            </a>
          </div>
        );
      })}
      {directories.map((directory) => {
        return (
          <div className='p-2 pr-0'>
            <h4 className='text-md border-b p-1 pr-0 font-semibold'>
              {directory.metadata.title}
            </h4>
            <ul className='p-1 pr-0 text-sm'>
              {directory.posts.map((post) => {
                return (
                  <li className='line-clamp-1  block truncate p-1 hover:text-blue-500'>
                    <a href={`/docs/${post.slug}`}>
                      {post.metadata.title}
                      {post.metadata.labels
                        ? post.metadata.labels
                            .split(',')
                            .map((label) => (
                              <span className='ml-1 rounded-sm bg-teal-700 p-1 py-0.5 text-xs text-white'>
                                {label}
                              </span>
                            ))
                        : null}
                    </a>
                  </li>
                );
              })}
            </ul>
            <SideBarNav posts={[]} directories={directory.directories} />
          </div>
        );
      })}
    </>
  );
}
