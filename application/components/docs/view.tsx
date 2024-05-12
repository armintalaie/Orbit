'use client';
import { useEffect, useRef, useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ArrowUp } from 'lucide-react';
import Link from 'next/link';

const MobileThreshold = 900;

export default function DocView({ children, posts, directories }) {
  const [isMobile, setIsMobile] = useState(false);
  const div = useRef(null);

  const handleResize = () => {
    if (div.current) {
      setIsMobile(div.current.clientWidth < MobileThreshold);
    }
  };

  useEffect(() => {
    if (div.current) {
      setIsMobile(div.current.clientWidth < MobileThreshold);
    }

    window.addEventListener('resize', handleResize);
  }, [div.current]);

  const component = isMobile ? (
    <MobileView posts={posts} directories={directories}>
      {children}
    </MobileView>
  ) : (
    <DesktopView posts={posts} directories={directories}>
      {children}
    </DesktopView>
  );

  return (
    <div ref={div} className='flex flex-1 overflow-hidden'>
      {component}
    </div>
  );
}

function SideBarNav({
  posts,
  directories,
  trigger,
}: {
  posts: any;
  directories: any;
  trigger?: any;
}) {
  const handleTrigger = () => {
    if (trigger) {
      trigger(false);
    }
  };
  return (
    <div className='flex w-full flex-col overflow-scroll p-2 pr-0'>
      {posts.map((post) => {
        return (
          <div>
            <Link
              onClick={handleTrigger}
              className='line-clamp-1 block truncate p-1 pr-0 hover:text-blue-500'
              href={`/docs/${post.slug}`}
            >
              {post.metadata.title}
            </Link>
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
                  <li className='line-clamp-1  block truncate p-1 hover:text-teal-600'>
                    <Link href={`/docs/${post.slug}`} onClick={handleTrigger}>
                      {post.metadata.title}
                      {post.metadata.labels
                        ? post.metadata.labels
                            .split(',')
                            .map((label) => (
                              <span className='ml-1 rounded-sm bg-teal-700 p-1 py-0.5 text-xs '>
                                {label}
                              </span>
                            ))
                        : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <SideBarNav
              posts={[]}
              directories={directory.directories}
              trigger={trigger}
            />
          </div>
        );
      })}
    </div>
  );
}

function MobileView({ children, posts, directories }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className='flex flex-1  flex-col justify-center overflow-y-hidden'>
      <div className='flex flex-1  flex-col  overflow-y-scroll'>{children}</div>
      <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
        <DrawerTrigger className='rounded-t-3xl border-t-2  p-3 '>
          <button className='' onClick={() => setIsOpen(true)}>
            <ArrowUp />
          </button>
        </DrawerTrigger>
        <DrawerContent className='  max-h-[65vh] overflow-auto '>
          <DrawerTitle className='px-4 text-sm'>Directory</DrawerTitle>
          <SideBarNav
            posts={posts}
            directories={directories}
            trigger={setIsOpen}
          />
        </DrawerContent>
      </Drawer>
    </div>
  );
}

const DesktopView = ({ children, posts, directories }) => {
  return (
    <section className='flex flex-1 overflow-y-hidden p-4'>
      <aside className=' w-72 overflow-y-scroll text-sm '>
        <SideBarNav posts={posts} directories={directories} />
      </aside>
      <div className='flex h-full flex-1 justify-center overflow-y-hidden'>
        {children}
      </div>
    </section>
  );
};
