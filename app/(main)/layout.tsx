'use client';
import { FeedbackButton } from '@/components/feedback';
import { Box, Text } from '@radix-ui/themes';
import React, { useContext, useEffect, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from '@/components/ui/command';
import Link from 'next/link';
import {
  BoxIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CircleDot,
  FolderClosed,
  MenuIcon,
  Users,
  Users2Icon,
} from 'lucide-react';
import { Changelog } from '@/components/changelog';
import NextBreadcrumb from '@/components/nextBreadcrumb';
import AuthContextProvider, {
  UserSessionContext,
} from '@/lib/context/AuthProvider';
import { SettingsModalButton } from '@/components/settings/SettingsModal';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { CaretSortIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthContextProvider>
      <div className='flex h-screen w-screen flex-row'>
        <SideBarContent className={'hidden w-56'} />

        <div className='flex flex-grow  flex-col-reverse overflow-hidden md:flex-col'>
          <div className='h-15 flex w-full items-center justify-between  border-t border-gray-100 md:border-b md:border-t-0  '>
            <NextBreadcrumb
              homeElement={
                <MenuDialog>
                  <SideBarContent className='w-full' showLogo={false} />
                </MenuDialog>
              }
              activeClasses='hidden'
              containerClasses='flex py-5 px-2  from-purple-600 to-blue-600 h-12 items-center '
              listClasses='hover:underline px-2 '
              capitalizeLinks
            />
          </div>
          {children}
        </div>
      </div>
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
  const [userTeams, setUserTeams] = useState([]);
  const userSession = useContext(UserSessionContext);

  async function fetchTeams() {
    const member = userSession?.user?.id;
    const res = await fetch(
      `/api/teams?q=${encodeURIComponent(JSON.stringify({ member: member }))}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await res.json();
    setUserTeams(data);
  }

  useEffect(() => {
    fetchTeams();
  }, []);
  return (
    <section
      id='sidebar '
      className={` flex-col  border-r border-gray-100 md:flex ${className}`}
    >
      {showLogo && (
        <div className='flex flex-row items-center justify-between '>
          <Text size='4' className='h-12 p-4 font-bold'>
            Orbit
          </Text>
        </div>
      )}
      <div className='flex flex-grow flex-col gap-3 overflow-y-auto border-t border-gray-100 p-2'>
        <CommandMenu setOpen={openSearch} open={search} />
        <Box className='w-full p-1 pb-3'>
          <button
            className='h-8 w-full rounded-sm border border-gray-200 bg-white p-1 px-2 text-left text-xs text-gray-500 shadow-sm'
            onClick={() => openSearch(true)}
          >
            <span className='flex items-center justify-between'>
              Search{' '}
              <span className='rounded-sm border border-gray-200 bg-gray-100 px-1 text-[9px] shadow-sm'>
                cmd + k
              </span>
            </span>
          </button>
        </Box>
        <section className='flex flex-col border-gray-100 '>
          <Link
            href={'/issues/me'}
            className=' flex h-8 w-full items-center p-1  px-2 text-left text-sm text-gray-700'
          >
            <CircleDot className='h-3 w-3 ' />
            <span className='flex h-full items-center justify-between pl-2'>
              My Issues
            </span>
          </Link>
          <Link
            href={'/projects'}
            className=' flex h-8 w-full items-center p-1  px-2 text-left text-sm text-gray-700'
          >
            <BoxIcon className='h-3 w-3 ' />
            <span className='flex h-full items-center justify-between pl-2'>
              Projects
            </span>
          </Link>

          <TeamsSidebarSection teams={userTeams} />
        </section>
      </div>
      <div className='flex flex-col  gap-2 overflow-y-auto p-2'>
        <SettingsModalButton />
        <div className='flex flex-row  gap-2 overflow-y-auto '>
          <FeedbackButton />
          <Changelog />
        </div>
      </div>
    </section>
  );
}

export function CommandMenu({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder='Under Development... stay tuned :)' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
      </CommandList>
    </CommandDialog>
  );
}

function MenuDialog({ children }: { children?: React.ReactNode }) {
  return (
    <Drawer>
      <DrawerTrigger>
        {' '}
        <MenuIcon className='h-4 w-4' />
      </DrawerTrigger>
      <DrawerContent>{children}</DrawerContent>
    </Drawer>
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
          className=' flex h-8 w-full items-center p-1  px-2 text-left text-sm text-gray-700'
        >
          <FolderClosed className='h-3 w-3 ' />
          <span className='flex h-full items-center justify-between pl-2'>
            Teams
          </span>
        </Link>

        <CollapsibleTrigger asChild>
          <Button variant='ghost' size='sm'>
            {isOpen ? (
              <ChevronDownIcon className='h-4 w-4 text-gray-600' />
            ) : (
              <ChevronRightIcon className='h-4 w-4 text-gray-600 ' />
            )}
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className='space-y-2 px-2 '>
        {teams.map((team, index) => (
          <Link
            href={`/teams/${team.id}`}
            key={index}
            className=' flex h-fit w-full items-center  px-2 pb-1 text-left text-xs text-gray-700'
          >
            <Users2Icon className='h-3 w-3 ' />
            <span className='flex h-full items-center justify-between pl-2'>
              {team.name}
            </span>
          </Link>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
