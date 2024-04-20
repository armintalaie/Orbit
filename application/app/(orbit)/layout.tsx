'use client';

import React, { useContext, useState } from 'react';
import Link from 'next/link';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ConstructionIcon,
  FolderClosed,
  Grid2x2Icon,
  GridIcon,
  InboxIcon,
  LayoutGrid,
  PanelLeft,
  SearchIcon,
  TargetIcon,
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
import { FeedbackButton } from '@/components/feedback';
import { Changelog } from '@/components/changelog';

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthContextProvider>
      <OrbitContextProvider>
        <div className='flex h-[100svh] w-[100svw] flex-row dark:bg-neutral-900 dark:text-neutral-200 '>
          <span
            id='confettiReward'
            className='pointer-events-none fixed inset-0 left-1/2 top-1/2 z-50 h-2 w-2 -translate-x-1/2 -translate-y-1/2 transform'
          />
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
              <div className='flex items-center gap-2 '>
                <Changelog />

                <FeedbackButton />
                <ThemeToggle />
              </div>
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
          <span className='h-12 p-4 font-bold dark:text-white'>Orbit<span className='text-2xs text-neutral-600 p-1 font-semibold'>Launch Pad</span></span>
        </div>
      )}
      <div className='flex flex-grow flex-col gap-3 overflow-y-auto border-t border-gray-100 p-2 dark:border-neutral-800'>
        <CommandMenu setOpen={openSearch} open={search} />
        <div className='w-full p-1 '>
          <button
            className='h-8 w-full rounded-sm border border-gray-200 bg-white p-1 px-2 text-left text-sm text-gray-500 shadow-sm dark:border-neutral-800 dark:bg-neutral-800'
            onClick={() => openSearch(true)}
          >
            <span className='flex items-center justify-between text-sm'>
              <SearchIcon className='h-4 w-4' />
              {/* <ConstructionIcon className='h-4 w-4' /> */}
              Search{' '}
              <span className='rounded-sm border border-gray-200 bg-gray-100 px-1 text-[9px] shadow-sm dark:border-neutral-800 dark:bg-neutral-700'>
                cmd + k
              </span>
            </span>
          </button>
        </div>
        <section className='flex flex-col border-gray-100 '>
        <section className='flex flex-col border-gray-100 pb-5 '>
        <div className='flex items-center justify-between  '>
        <Link
          href={'/teams'}
          shallow={true}
          className=' flex h-8 w-full items-center   text-left text-2xs  text-gray-700 dark:text-neutral-400 '
        >
          {/* <div className='h-3 w-3 ' /> */}
          <span className='flex h-full items-center justify-between p-0'>
            My Space
          </span>
        </Link>
        </div>
          <Link
            href={'/issues/me'}
            className=' flex h-8 w-full items-center p-1  px-2 text-left text-xs text-gray-700 dark:text-neutral-400'
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
            className=' flex h-8 w-full items-center p-1  px-2 text-left text-xs text-gray-700 dark:text-neutral-400'
          >
            <LayoutGrid className='h-3 w-3 ' />
            <span className='flex h-full items-center justify-between pl-2'>
              Projects
            </span>
          </Link>
          </section>

          <TeamsSidebarSection teams={teams} />
        </section>
      </div>
      <div className='flex flex-col  gap-2 overflow-y-auto p-2'>
        <Link
          href={'/settings'}
          shallow={true}
          className=' flex h-8 w-full items-center p-1  px-2 text-left text-xs  text-gray-700 dark:text-neutral-400'
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
      <div className='flex items-center justify-between  '>
        <Link
          href={'/teams'}
          shallow={true}
          className=' flex h-8 w-full items-center   text-left text-2xs  text-gray-700 dark:text-neutral-400 '
        >
          {/* <div className='h-3 w-3 ' /> */}
          <span className='flex h-full items-center justify-between p-0'>
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

      <CollapsibleContent className='space-y-2  '>

        {teams.map((team, index) => (
          // <Link
          //   href={`/teams/${team.id}`}
          //   key={index}
          //   shallow={true}
          //   className=' flex h-fit w-full items-center  p-1 px-2 text-left text-xs text-gray-700 dark:text-neutral-400'
          // >
          //   <span className='flex h-full items-center justify-between pl-2 text-xs'>
          //     {team.name}
          //   </span>
          // </Link>
          <TeamSection team={team} key={index} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}


function TeamSection({ team }: { team: any[] }) {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className='w-full p-0  '
    >
      <div className='flex items-center justify-between '>
        <Link
          href={`/teams/${team.id}`}
          shallow={true}
          className=' flex h-8 w-full items-center p-1   text-left text-sm text-gray-700 dark:text-neutral-400'
        >
          <div className='h-5 w-5 rounded-md p-1 bg-neutral-100 dark:bg-neutral-800'>
          <FolderClosed className='h-full w-full ' />
          </div>

          <span className='flex h-full items-center justify-between pl-1 text-xs'>
            {team.name}
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

      <CollapsibleContent className=' px-2 '>
        <Link className='flex relative flex-col  justify-between z-10 text-gray-600 dark:text-neutral-300 pl-4 text-xs' href={`/teams/${team.id}`}>
          <div className='flex items-center gap-1 z-10'>
          <div className='h-4 w-4 rounded-sm p-1 bg-neutral-100  dark:bg-neutral-800'>
          <InboxIcon className='h-full w-full ' />
          </div>
          <span>
            Issues
          </span>
          </div>

          <div className='h-full w-[1px] left-[24px] absolute bg-neutral-100 dark:bg-neutral-800' />
         
          <section className='flex flex-col border-gray-100 py-1 '>
            <Link
              href={`/teams/${team.id}`}
              className=' flex h-6 w-full items-center    text-left text-2xs text-gray-700 dark:text-neutral-400'
              shallow={true}
            >
              <div className='h-3 w-3 ' />
              <span className='flex h-full items-center justify-between pl-2'>
                Backlog
              </span>
            </Link>
            <Link
              href={`/projects`}
              shallow={true}
              className=' flex h-6 w-full items-center    text-left text-2xs text-gray-700 dark:text-neutral-400'
            >
              <div className='h-3 w-3 ' />
              <span className='flex h-full items-center justify-between pl-2'>
                Active
              </span>
            </Link>
          </section>
        </Link>
        <Link className='flex relative flex-col text-gray-600 dark:text-neutral-300 justify-between z-10 pl-4 text-xs' href={`/teams/${team.id}`}>
          <div className='flex items-center gap-1 z-10'>
          <div className='h-4 w-4 rounded-sm p-1 bg-neutral-100  dark:bg-neutral-800'>
          <LayoutGrid className='h-full w-full ' />
          </div>
          <span>
            Projects
          </span>
          </div>
          </Link>
      </CollapsibleContent>
    </Collapsible>
  );
}
