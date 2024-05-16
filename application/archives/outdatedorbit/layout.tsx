'use client';

import React, { useContext, useState } from 'react';
import Link from 'next/link';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CommandIcon,
  FolderClosed,
  InboxIcon,
  LayoutGrid,
  PanelLeft,
} from 'lucide-react';
import NextBreadcrumb from '@/components/nextBreadcrumb';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import AuthContextProvider from '@/lib/context/AuthProvider';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CommandMenu } from '@/components/globalCommand';
import OrbitContextProvider, { OrbitContext } from '@/lib/context/OrbitContext';
import { GearIcon } from '@radix-ui/react-icons';
import ThemeToggle from '@/components/themeToggle';
import { FeedbackButton } from '@/components/feedback';
import { Changelog } from '@/components/changelog';
import useSWR from 'swr';
import Spinner from '@/components/general/Spinner';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import PreviewModalProvider from '@/lib/context/PreviewModalProvider';
import { DraggableModalWindow } from '@/lib/context/DraggableModalWindow';

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthContextProvider>
      <OrbitContextProvider>
        <div className='flex h-[100svh] w-[100svw] flex-row dark:bg-neutral-900 dark:text-neutral-200 '>
          <span
            id='confettiReward'
            className='pointer-events-none fixed inset-0 left-1/2 top-1/2 z-50 h-2 w-2 -translate-x-1/2 -translate-y-1/2 transform'
          />
          <PreviewModalProvider>
            <SideBarContent className={' w-72 min-w-56'} />
            <div className='flex w-full  flex-col overflow-hidden md:flex-col'>{children}</div>
            <DraggableModalWindow />
          </PreviewModalProvider>
        </div>
      </OrbitContextProvider>
    </AuthContextProvider>
  );
}

function SideBarContent({ className, showLogo = true }: { className?: string; showLogo?: boolean }) {
  const [search, openSearch] = useState(false);
  const { teams } = useContext(OrbitContext);
  return (
    <section
      id='sidebar '
      className={` flex h-full flex-col border-r border-gray-100 dark:border-neutral-800 dark:bg-neutral-900 lg:flex ${className} justify-between `}
    >
      <div className='flex items-center justify-between gap-2 p-2'>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className='flex h-8 w-full flex-row items-center  justify-between gap-2 rounded border  border-neutral-200 bg-white p-1  px-3 text-gray-700 shadow-sm dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-400'
              variant='ghost'
            >
              <span className=' text-left text-xs   font-normal dark:text-neutral-300 '>UBC Launch Pad</span>
              <ChevronDownIcon className='h-4 w-4  text-gray-600 dark:text-neutral-400' />
            </Button>
          </DialogTrigger>
          <DialogContent className='min-h-60 w-full max-w-lg px-0'>
            <UserWorkspaces />
          </DialogContent>
        </Dialog>

        <button
          className='h-8 w-fit rounded-sm border border-neutral-200 bg-white p-1 px-2 text-left text-sm text-gray-700 shadow-sm dark:border-neutral-800 dark:bg-neutral-800 dark:text-gray-300'
          onClick={() => openSearch(true)}
        >
          <span className='flex items-center justify-between text-sm'>
            <CommandIcon className='h-3 w-3' />
          </span>
        </button>
      </div>

      <div className='flex flex-grow flex-col gap-3 overflow-y-auto border-t border-gray-100  dark:border-neutral-800'>
        <CommandMenu setOpen={openSearch} open={search} />

        <section className='flex flex-col border-gray-100 '>
          <section className='flex flex-col border-gray-100 pb-5 pl-2 '>
            <div className='flex items-center justify-between  '>
              <Link
                href={'/teams'}
                shallow={true}
                className=' flex h-8 w-full items-center   text-left text-2xs  text-gray-700 dark:text-neutral-400 '
              >
                {/* <div className='h-3 w-3 ' /> */}
                <span className='flex h-full items-center justify-between p-0'>My Space</span>
              </Link>
            </div>
            <Link
              href={'/issues/me'}
              className=' flex h-8 w-full items-center p-1  px-2 text-left text-xs text-gray-700 dark:text-neutral-400'
              shallow={true}
            >
              <InboxIcon className='h-3 w-3 ' />
              <span className='flex h-full items-center justify-between pl-2'>My Issues</span>
            </Link>
            <Link
              href={'/projects'}
              shallow={true}
              className=' flex h-8 w-full items-center p-1  px-2 text-left text-xs text-gray-700 dark:text-neutral-400'
            >
              <LayoutGrid className='h-3 w-3 ' />
              <span className='flex h-full items-center justify-between pl-2'>Projects</span>
            </Link>
          </section>

          <TeamsSidebarSection teams={teams} />
        </section>
      </div>
      <div className='j flex flex-row gap-2 overflow-y-auto p-2 text-neutral-700'>
        <Link href={'/settings'} shallow={true}>
          <Button
            variant='outline'
            size='icon'
            className='h-6 w-6 rounded-md p-0 dark:border-neutral-900 dark:bg-neutral-800 dark:text-neutral-300'
          >
            <GearIcon className=' h-3 w-3' />
          </Button>
        </Link>
        <div className='flex-1' />
        <ThemeToggle />
        <Changelog />
        <FeedbackButton />
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
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className='w-full p-0  '>
      <div className='flex items-center justify-between  border-t border-gray-100 pl-2 dark:border-neutral-800'>
        <Link
          href={'/teams'}
          shallow={true}
          className=' flex h-8 w-full items-center   text-left text-2xs  text-gray-700 dark:text-neutral-400 '
        >
          {/* <div className='h-3 w-3 ' /> */}
          <span className='flex h-full items-center justify-between p-0'>Teams</span>
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

      <CollapsibleContent className='space-y-2 border-b pb-4  '>
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
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className='w-full p-0  '>
      <div className='flex items-center justify-between '>
        <Link
          href={`/teams/${team.id}`}
          shallow={true}
          className=' flex h-8 w-full items-center p-1   text-left text-sm text-gray-700 dark:text-neutral-400'
        >
          <div className='h-5 w-5 rounded-md bg-neutral-100 p-1 dark:bg-neutral-800'>
            <FolderClosed className='h-full w-full ' />
          </div>

          <span className='flex h-full items-center justify-between pl-1 text-xs'>{team.name}</span>
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
        <Link
          className='relative z-10 flex flex-col justify-between pb-4 pl-4 text-xs text-gray-600 dark:text-neutral-300'
          href={`/teams/${team.id}?view=issues`}
        >
          <div className='z-10 flex items-center gap-1'>
            <div className='h-4 w-4 rounded-sm bg-neutral-100 p-1  dark:bg-neutral-800'>
              <InboxIcon className='h-full w-full ' />
            </div>
            <span>Issues</span>
          </div>

          <div className='absolute left-[24px] h-full w-[1px] bg-neutral-100 dark:bg-neutral-800' />

          <section className='flex flex-col border-gray-100 py-1 '>
            <Link
              href={`/teams/${team.id}`}
              className=' flex h-6 w-full items-center    text-left text-2xs text-gray-700 dark:text-neutral-400'
              shallow={true}
            >
              <div className='h-3 w-3 ' />
              <span className='flex h-full items-center justify-between pl-2'>Backlog</span>
            </Link>
            <Link
              href={`/projects`}
              shallow={true}
              className=' flex h-6 w-full items-center    text-left text-2xs text-gray-700 dark:text-neutral-400'
            >
              <div className='h-3 w-3 ' />
              <span className='flex h-full items-center justify-between pl-2'>Active</span>
            </Link>
          </section>
        </Link>

        <Link
          className='relative z-10 flex flex-col justify-between pl-4 text-xs text-gray-600 dark:text-neutral-300'
          href={`/teams/${team.id}?view=projects`}
        >
          <div className='z-10 flex items-center gap-1'>
            <div className='h-4 w-4 rounded-sm bg-neutral-100 p-1  dark:bg-neutral-800'>
              <LayoutGrid className='h-full w-full ' />
            </div>
            <span>Projects</span>
          </div>
        </Link>
      </CollapsibleContent>
    </Collapsible>
  );
}

function UserWorkspaces() {
  const { fetcher, profile } = useContext(OrbitContext);
  const { data, isLoading, error } = useSWR(`/api/profiles/${profile.id}/workspaces`, {
    fetcher: () => fetcher(`/api/profiles/${profile.id}/workspaces`).then((res) => res.json()),
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className='flex flex-col border-gray-100 pb-5  '>
      <h2 className='border-b p-3 text-xs font-semibold text-gray-700 dark:text-neutral-300'>Workspaces</h2>
      <div className='flex flex-col items-center justify-between gap-4 '>
        {data.map((workspace, index) => (
          <Link
            href={`/workspaces/${workspace.id}`}
            key={index}
            shallow={true}
            className=' flex h-10 w-full items-center gap-4  border-b p-1 px-2  text-left text-sm text-gray-700 hover:bg-neutral-200 dark:text-neutral-400'
          >
            <div className='h-5 w-5 rounded-md bg-blue-100 p-1 dark:bg-neutral-800'>
              <FolderClosed className='h-full w-full ' />
            </div>
            <span className='flex h-full items-center justify-between pl-2'>{workspace.name}</span>
          </Link>
        ))}
        <Button variant='ghost' size='sm' className='h-8 w-full text-left text-sm text-gray-700 dark:text-neutral-400'>
          <span className='flex h-full items-center justify-between pl-2'>Create Workspace</span>
        </Button>
      </div>
    </div>
  );
}
