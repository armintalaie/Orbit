import Link from 'next/link';
import { getAllBlogPostMetadata } from './utils';

export default function Layout({ children }) {
  const { posts, directories } = getAllBlogPostMetadata();

  return (
    <div className='dark flex h-screen max-h-screen flex-col overflow-hidden bg-neutral-950 text-white'>
      <nav className=' flex w-full items-center justify-between border-b p-2 px-4 text-center'>
        <div className='flex w-full items-center justify-between '>
          <h2>Orbit Docs</h2>
          <div className='flex items-center gap-4'>
            <Link
              href='/'
              className='h-full w-24 rounded-lg bg-gradient-to-r from-teal-900 to-teal-800 p-0.5 text-sm text-white'
            >
              <p className='w-full rounded-md bg-neutral-950 p-2'>Orbit</p>
            </Link>
            <input
              type='text'
              placeholder='Search'
              className='rounded-lg bg-neutral-900 p-2 text-white'
            />
          </div>
        </div>
      </nav>
      <section className='flex flex-1 overflow-y-hidden p-4'>
        <aside className='h-screen w-72 overflow-y-scroll text-sm text-white'>
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
                    <a href={`/docs/${post.slug}`}>{post.metadata.title}</a>
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
