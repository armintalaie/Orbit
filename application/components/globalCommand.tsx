'use client';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import React from 'react';
import {
  SearchIcon,
  PlusCircleIcon,
  LayoutGridIcon,
  SettingsIcon,
  LogOutIcon,
  PanelLeft,
  Link,
  FolderClosed,
  ChevronDownIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { NewIssue } from './newIssue';

export function CommandMenu({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  React.useEffect(() => {
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
      <CommandInput placeholder='Type a command or search...' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading='Issues' className='text-xs'>
          <CommandItem>
            <SearchIcon className='mr-2 h-2 w-2 text-xs' />
            <span>Search issues</span>
          </CommandItem>
          <CommandItem className='gap-2'>
            <NewIssue />
            <span className=''>New issue</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading='Projects' className='text-xs'>
          <CommandItem>
            <LayoutGridIcon className='mr-2 h-2 w-2 text-xs' />
            <span>View projects</span>
          </CommandItem>
          <CommandItem className=''>
            <PlusCircleIcon className='mr-2 h-2 w-2 ' />
            <span className=''>New project</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading='Profile' className='text-xs'>
          <CommandItem>
            <SettingsIcon className='mr-2 h-2 w-2 text-xs' />
            <span>Settings</span>
          </CommandItem>
          <CommandItem className=''>
            <LogOutIcon className='mr-2 h-2 w-2 ' />
            <span className=''>Sign out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
