'use client';

import { STATUS } from '@/lib/util';
import Link from 'next/link';
import {
  ContextMenuContent,
  ContextMenuItem,
} from '@/components/ui/context-menu';
import {
  ArrowLeftCircle,
  CircleSlashIcon,
  ExternalLinkIcon,
  Trash2Icon,
} from 'lucide-react';
import { useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { statusIconMapper } from '@/components/statusIconMapper';

let contextMenuOptions = [
  {
    id: 'open-in-new-tab',
    triggerComponent: (updateView, href) => (
      <ContextMenuItem
        onClick={() => {
          updateView();
        }}
      >
        <Link
          href={href}
          shallow={true}
          aria-disabled={true}
          target='_blank'
          referrerPolicy='no-referrer'
          className='flex flex-row items-center gap-3 text-sm'
        >
          <ExternalLinkIcon className='h-4 w-4' />
          Open in new tab
        </Link>
      </ContextMenuItem>
    ),
    openComponent: null,
  },
  // {
  //   id: 'assign-to',
  //   triggerComponent: () => (<div className='flex flex-row items-center gap-3 text-sm'>
  //   <UserIcon className='h-4 w-4' />
  //   Assign to...
  // </div>),
  // },
  {
    id: 'set-status',

    triggerComponent: (updateView, href) => (
      <ContextMenuItem
        onClick={() => {
          updateView('set-status');
        }}
      >
        <div className='flex flex-row items-center gap-3 text-sm'>
          <CircleSlashIcon className='h-4 w-4' />
          Set Status...
        </div>
      </ContextMenuItem>
    ),
  },
  // {
  //   id: 'add-label',
  //   triggerComponent: () => (<div className='flex flex-row items-center gap-3 text-sm'>
  //   <TagsIcon className='h-4 w-4' />
  //   Add Label...
  // </div>),

  //   },
  //   {
  //     id: 'move-to',
  //     triggerComponent: () => (<div className='flex flex-row items-center gap-3 text-sm'>
  //     <Replace className='h-4 w-4' />
  //     Move to...
  //   </div>),

  //     },
  //     {
  //       id: 'delete',
  //       triggerComponent: () => (<div className='flex flex-row items-center gap-3 text-sm'>
  //       <Trash2Icon className='h-4 w-4' />
  //       Delete
  //     </div>),
  //     }
];

function SetStatusMenuComponent({
  issue,
}: {
  issue: any;
  backBtn: () => void;
}) {
  const status = STATUS || [];
  return (
    <Command className='rounded-md border-gray-200  bg-inherit '>
      <div className='flex h-full items-center gap-2'>
        <CommandInput placeholder='Search...' className='w-full border-none' />
      </div>

      <CommandEmpty>No status</CommandEmpty>
      <CommandGroup>
        {status.map((st) => (
          <CommandItem
            key={st.id}
            value={st.label}
            onSelect={(currentValue) => {
              // addFilter({ key: st.id, value: st.label, type: 'status' });
              // setOpen(false)
            }}
          >
            <div className='flex items-center gap-2'>
              {statusIconMapper(st.label, 'h-4 w-4')}
              <span>{st.label}</span>
            </div>
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  );
}

export default function IssueMenuContext({
  issue,
  reload,
}: {
  issue: any;
  reload: () => void;
}) {
  const [optionGroup, setOptionGroup] = useState('main');

  return (
    <ContextMenuContent className='w-62  rounded-md border border-gray-200 bg-gray-50  shadow-sm'>
      {optionGroup === 'main' &&
        contextMenuOptions.map((option) => {
          return option.triggerComponent(setOptionGroup, '');
        })}

      {optionGroup !== 'main' && (
        <ContextMenuItem
          className='flex flex-row items-center gap-3 text-sm'
          onClick={() => {
            setOptionGroup('main');
          }}
        >
          <ArrowLeftCircle className='h-4 w-4' />
          Back
        </ContextMenuItem>
      )}

      {optionGroup === 'set-status' && (
        <SetStatusMenuComponent issue={issue} backBtn={() => {}} />
      )}

      <ContextMenuItem
        className='flex flex-row items-center gap-3 text-sm'
        onClick={() => {
          fetch(`/api/projects/${issue.projectid}/issues/${issue.id}`, {
            method: 'DELETE',
          }).then(() => {
            reload && reload();
          });
        }}
      >
        <Trash2Icon className='h-4 w-4' />
        Delete
      </ContextMenuItem>
    </ContextMenuContent>
  );
}
