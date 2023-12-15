'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import React from 'react';
// import { buttonVariants } from "@/registry/new-york/ui/button"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'flex space-x-2 border-r border-gray-100 lg:flex-col lg:space-x-0 lg:space-y-1',
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            pathname === item.href
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-transparent hover:underline',
            'justify-start'
          )}
        >
          <button className='w-full rounded-md px-4 py-2 text-left text-sm font-medium text-gray-900 transition hover:bg-gray-100 focus:bg-gray-100 focus:outline-none'>
            {item.title}
          </button>
        </Link>
      ))}
    </nav>
  );
}
