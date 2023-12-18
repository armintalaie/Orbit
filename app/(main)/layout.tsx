'use client';
import { FeedbackButton } from '@/components/feedback';
import { Box, Container, Text } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { GearIcon } from '@radix-ui/react-icons';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command';
import Link from 'next/link';
import { BoxIcon, CircleDot, MenuIcon, PinIcon, Users } from 'lucide-react';
import { Changelog } from '@/components/changelog';
import NextBreadcrumb from '@/components/nextBreadcrumb';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [openT, setOpenT] = useState(true);
  const [search, openSearch] = useState(false);
  const [openP, setOpenP] = useState(false);

  async function fetchTeams() {
    const res = await fetch('/api/teams');
    const teams = await res.json();
    setTeams(teams);
  }
  async function fetchProjects() {
    const res = await fetch('/api/projects');
    const projects = await res.json();
    setProjects(projects);
  }

  useEffect(() => {
    // fetchProjects();
    // fetchTeams();
  }, []);

  return (
    <div className='flex h-screen w-screen flex-row'>
      <section
        id='sidebar '
        className='hidden w-56 flex-col  border-r border-gray-100 md:flex'
      >
        <div className='flex flex-row items-center justify-between '>
          {/* <Image src='/icon.png' alt='logo'   width={10} height={10}/> */}
          <Text size='4' className='h-12 p-4 font-bold'>
            Orbit
          </Text>
        </div>
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

            <Link
              href={'/teams'}
              className=' flex h-8 w-full items-center p-1  px-2 text-left text-sm text-gray-700'
            >
              <Users className='h-3 w-3 ' />
              <span className='flex h-full items-center justify-between pl-2'>
                Teams
              </span>
            </Link>
          </section>

          {/* <section id="projects" className="flex flex-col border-gray-100 ">
               
               
                    <Collapsible.Root open={openP} onOpenChange={setOpenP}>
                        <span className="flex flex-row items-center justify-between px-1">
                    <Text size="2" className="p-2 font-medium text-gray-700">Projects</Text>
                    <Collapsible.Trigger asChild>
                        <button className="IconButton">{openP ? <Cross2Icon /> : <RowSpacingIcon />}</button>
                        </Collapsible.Trigger>
        </span>
                   
                    <Collapsible.Content>
                    <div className="flex flex-col flex-grow overflow-y-auto p-2 gap-2 pl-4">
                        {projects.map((project) => (
                            <li key={project.id} className="flex flex-row items-center justify-between px-1">
                                <Link href={`/projects/${project.id}`}
                                shallow={true}
                                >
                                <Text size="1">{project.title}</Text>
                                </Link>
                            </li>
                        ))}
                    </div>
                    </Collapsible.Content>
                    </Collapsible.Root>

                    </section> */}
          {/* <section
            id='teams'
            className='flex flex-col border-t border-gray-100 '
          >
            <Collapsible.Root open={openT} onOpenChange={setOpenT}>
              <span className='flex flex-row items-center justify-between px-1'>
                <Text size='2' className='p-2 font-medium text-gray-700'>
                  Your Teams
                </Text>
                <Collapsible.Trigger asChild>
                  <button className='IconButton'>
                    {openT ? <Cross2Icon /> : <RowSpacingIcon />}
                  </button>
                </Collapsible.Trigger>
              </span>

              <Collapsible.Content>
                <div className='flex flex-grow flex-col gap-2 overflow-y-auto p-2 pl-4'>
                  {teams.map((team) => (
                    <li
                      key={team.id}
                      className='flex flex-row items-center justify-between px-1'
                    >
                      <a href={`/teams/${team.name}`}>
                        <Text size='1'>{team.name}</Text>
                      </a>
                    </li>
                  ))}
                </div>
              </Collapsible.Content>
            </Collapsible.Root>
          </section> */}
        </div>
        <div className='flex flex-col  gap-2 overflow-y-auto p-2'>
          <Link
            href={'/settings'}
            className='flex h-8 w-full items-center rounded-sm border border-gray-200 bg-white p-1 px-2 text-left text-xs text-gray-500 shadow-sm'
          >
            <GearIcon className='mr-2 h-3 w-3' />
            <span>Settings</span>
          </Link>

          <div className='flex flex-row  gap-2 overflow-y-auto '>
            <FeedbackButton />
            <Changelog />
          </div>
        </div>
      </section>
      <div className='flex flex-grow flex-col overflow-hidden'>
        <div className='h-15 flex w-full items-center justify-between  border-b border-gray-100  '>
          <NextBreadcrumb
            homeElement={
              <MenuDialog
                open={openP}
                setOpen={setOpenP}
                search={search}
                openSearch={openSearch}
              />
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
  );
}

export function CommandMenu({ open, setOpen }) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
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
        {/* <CommandGroup heading='Suggestions'>
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup> */}
      </CommandList>
    </CommandDialog>
  );
}

function MenuDialog({ open, setOpen, search, openSearch }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <MenuIcon className='h-4 w-4' />
      </DialogTrigger>
      <DialogContent className='h-full   w-screen'>
        <section
          id='sidebar '
          className='flex h-full w-full  flex-col  border-gray-100'
        >
          <Text size='4' className='h-12 p-4 font-bold'>
            Orbit
          </Text>
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
                href={'/projects'}
                className=' flex h-8 w-full items-center p-1  px-2 text-left text-sm text-gray-700'
              >
                <BoxIcon className='h-3 w-3 ' />
                <span className='flex h-full items-center justify-between pl-2'>
                  Projects
                </span>
              </Link>

              <Link
                href={'/teams'}
                className=' flex h-8 w-full items-center p-1  px-2 text-left text-sm text-gray-700'
              >
                <BoxIcon className='h-3 w-3 ' />
                <span className='flex h-full items-center justify-between pl-2'>
                  Teams
                </span>
              </Link>
            </section>
          </div>
        </section>

        <DialogFooter className='sm:justify-start'>
          <DialogClose asChild></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
