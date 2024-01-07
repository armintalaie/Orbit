'use client';

import React, { useContext, useState } from 'react';
import Link from 'next/link';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ConstructionIcon,
  FolderClosed,
  InboxIcon,
  LayoutGridIcon,
  PanelLeft,
} from 'lucide-react';
import NextBreadcrumb from '@/components/nextBreadcrumb';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import AuthContextProvider from '@/lib/context/AuthProvider';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CommandMenu } from '@/components/globalCommand';
import OrbitContextProvider, { OrbitContext } from '@/lib/context/OrbitContext';
import { GearIcon } from '@radix-ui/react-icons';
import ThemeToggle from '@/components/themeToggle';

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthContextProvider>
      <OrbitContextProvider>
        <div className='flex h-[100svh] w-[100svw] flex-row dark:bg-neutral-900 dark:text-neutral-200 '>
          <SideBarContent className={'min-w-56 hidden w-72'} />
          <div className='flex w-full  flex-col overflow-hidden md:flex-col'>
            <div className='h-15 flex w-full items-center justify-between border-t  border-gray-100 px-4 dark:border-neutral-800 dark:bg-neutral-900 md:border-b md:border-t-0  '>
              <NextBreadcrumb
                homeElement={
                  <MenuDialog>
                    <SideBarContent className='w-full' showLogo={true} />
                  </MenuDialog>
                }
                activeClasses='hidden'
                containerClasses='flex py-5   w-fit h-12 items-center '
                listClasses='hover:underline px-2 '
                capitalizeLinks
              />
              <ThemeToggle />
            </div>
            {children}
          </div>
        </div>
      </OrbitContextProvider>
    </AuthContextProvider>
  );
}

function SideBarContent({
  className,
  showLogo = true,
}: {
  className?: string;
  showLogo?: boolean;
}) {
  const [search, openSearch] = useState(false);
  const { teams } = useContext(OrbitContext);
  return (
    <section
      id='sidebar '
      className={` flex h-full flex-col border-r border-gray-100 dark:border-neutral-800 dark:bg-neutral-900 lg:flex ${className} justify-between `}
    >
      {showLogo && (
        <div className='flex flex-row items-center justify-between '>
          <span className='h-12 p-4 font-bold dark:text-white'>Orbit</span>
        </div>
      )}
      <div className='flex flex-grow flex-col gap-3 overflow-y-auto border-t border-gray-100 p-2 dark:border-gray-900'>
        <CommandMenu setOpen={openSearch} open={search} />
        <div className='w-full p-1 pb-3'>
          <button
            className='h-8 w-full rounded-sm border border-gray-200 bg-white p-1 px-2 text-left text-sm text-gray-500 shadow-sm dark:border-neutral-800 dark:bg-neutral-800'
            onClick={() => openSearch(true)}
          >
            <span className='flex items-center justify-between text-sm'>
              <ConstructionIcon className='h-4 w-4' />
              Search{' '}
              <span className='rounded-sm border border-gray-200 bg-gray-100 px-1 text-[9px] shadow-sm dark:border-neutral-800 dark:bg-neutral-700'>
                cmd + k
              </span>
            </span>
          </button>
        </div>
        <section className='flex flex-col border-gray-100 '>
          <Link
            href={'/issues/me'}
            className=' flex h-8 w-full items-center p-1  px-2 text-left text-sm text-gray-700 dark:text-neutral-400'
            shallow={true}
          >
            <InboxIcon className='h-3 w-3 ' />
            <span className='flex h-full items-center justify-between pl-2'>
              My Issues
            </span>
          </Link>
          <Link
            href={'/projects'}
            shallow={true}
            className=' flex h-8 w-full items-center p-1  px-2 text-left text-sm text-gray-700 dark:text-neutral-400'
          >
            <LayoutGridIcon className='h-3 w-3 ' />
            <span className='flex h-full items-center justify-between pl-2'>
              Projects
            </span>
          </Link>

          <TeamsSidebarSection teams={teams} />
        </section>
      </div>
      <div className='flex flex-col  gap-2 overflow-y-auto p-2'>
        <Link
          href={'/settings'}
          shallow={true}
          className=' flex h-8 w-full items-center p-1  px-2 text-left text-sm text-gray-700 dark:text-neutral-400'
        >
          <GearIcon className='mr-2 h-3 w-3' />
          <span>Settings</span>
        </Link>
      </div>
    </section>
  );
}

function MenuDialog({ children }: { children?: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger>
        <PanelLeft className='h-4 w-4' />
      </SheetTrigger>
      <SheetContent side={'left'} className='w-72 max-w-full p-0'>
        {children}
      </SheetContent>
    </Sheet>
  );
}

function TeamsSidebarSection({ teams }: { teams: any[] }) {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className='w-full p-0  '
    >
      <div className='flex items-center justify-between '>
        <Link
          href={'/teams'}
          shallow={true}
          className=' flex h-8 w-full items-center p-1  px-2 text-left text-sm text-gray-700 dark:text-neutral-400'
        >
          <FolderClosed className='h-3 w-3 ' />
          <span className='flex h-full items-center justify-between pl-2'>
            Teams
          </span>
        </Link>

        <CollapsibleTrigger asChild>
          <Button variant='ghost' size='sm'>
            {isOpen ? (
              <ChevronDownIcon className='h-3 w-3 text-gray-600 dark:text-neutral-400' />
            ) : (
              <ChevronRightIcon className='h-3 w-3 text-gray-600 dark:text-neutral-400 ' />
            )}
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className='space-y-2 px-2 '>
        {teams.map((team, index) => (
          <Link
            href={`/teams/${team.id}`}
            key={index}
            shallow={true}
            className=' flex h-fit w-full items-center  p-1 px-2 text-left text-xs text-gray-700 dark:text-neutral-400'
          >
            <span className='flex h-full items-center justify-between pl-2 text-xs'>
              {team.name}
            </span>
          </Link>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
