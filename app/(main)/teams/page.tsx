'use client';

import { NewProject } from '@/components/newProject';
import { CardHeader, CardContent } from '@/components/ui/card';
import { dateFormater, isOverdue } from '@/lib/util';
import { TableIcon, BoxIcon, CaretDownIcon } from '@radix-ui/react-icons';
import {
  Badge,
  Button,
  Heading,
  Box,
  Text,
  ContextMenu,
  Table,
  DropdownMenu,
} from '@radix-ui/themes';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useEffect, useState } from 'react';
import { FilterIcon } from 'lucide-react';
import Link from 'next/link';
import { NewTeam } from '@/components/newTeam';

export default function TeamPage() {
  const [teams, setTeams] = useState([]);
  const viewTypes = ['board', 'table'];
  // const [viewType, setViewType] = useState(viewTypes[0]);

  async function reload() {
    const res = await fetch(`/api/teams`);
    const team = await res.json();
    setTeams(team);
  }

  useEffect(() => {
    async function fetchProjects() {
      const res = await fetch(`/api/teams`);
      const teams = await res.json();
      setTeams(teams);
    }

    fetchProjects();
  }, []);

  return (
    <div className='flex min-h-screen w-full flex-col'>
      <div className=' flex h-full w-full flex-1 flex-col '>
        <div className='flex h-12 w-full items-center justify-between p-4  px-4 '>
          <h1 className='text-md h-full font-medium leading-tight text-gray-700'>
            Teams
          </h1>
          <div className='flex h-full items-center justify-center gap-2'>
            <NewTeam button={true} reload={reload} />
          </div>
        </div>

        <div className=' flex h-full w-full flex-1 flex-col bg-gray-50 '>
          <div className='flex h-12 flex-row items-center justify-between border-y border-gray-100 bg-white p-2 py-3'>
            {/* <FilterGroup /> */}

            {/* <ToggleGroupDemo viewType={viewType} setViewType={setViewType} /> */}
          </div>
          <div className=' flex h-full flex-grow flex-col'>
            <TableView teams={teams} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TableView({ teams }) {
  return (
    <div className='flex h-full w-full flex-col '>
      <Table.Root className='w-full  overflow-hidden rounded-sm border-gray-200 bg-white shadow-none'>
        <Table.Body>
          {teams.map((team) => (
            <Table.Row key={team.id}>
              <Table.RowHeaderCell>
                <Link
                  href={`/teams/${team.id}`}
                  shallow={true}
                  className='underline'
                >
                  {team.name}
                </Link>
              </Table.RowHeaderCell>
              {/* <Table.Cell>{project.description}</Table.Cell>
              <Table.Cell>{project.status}</Table.Cell>
              <Table.Cell>
                {isOverdue(project.deadline) ? (
                  <Badge color='red'>{dateFormater(project.deadline)}</Badge>
                ) : (
                  <Badge color='gray'> {dateFormater(project.deadline)}</Badge>
                )}
              </Table.Cell>
              <Table.Cell>{project.dateCreated}</Table.Cell>
              <Table.Cell>{project.dateUpdated}</Table.Cell> */}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}

const ToggleGroupDemo = ({ viewType, setViewType }) => {
  return (
    <ToggleGroup.Root
      className='flex h-8 w-fit   flex-row  items-center justify-between divide-x divide-gray-200 overflow-hidden  rounded-sm border border-gray-200 bg-white text-left text-xs text-gray-500  shadow-sm'
      type='single'
      defaultValue='center'
      aria-label='Text alignment'
    >
      <ToggleGroup.Item
        className={`flex w-9 items-center justify-center p-2 ${
          viewType === 'table' ? 'bg-gray-100' : 'bg-inherit'
        }`}
        value='table'
        aria-label='Left aligned'
        onClick={() => setViewType('table')}
      >
        <TableIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={`flex w-9 items-center justify-center p-2 ${
          viewType === 'board' ? 'bg-gray-100' : 'bg-inherit'
        }`}
        value='board'
        aria-label='Center aligned'
        onClick={() => setViewType('board')}
      >
        <BoxIcon />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};

function FilterGroup({ filters, setFilters }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button className='flex h-8 items-center  justify-between rounded-sm border border-gray-200 bg-white p-1 px-4 text-left text-xs text-gray-500 shadow-sm'>
          <FilterIcon className='mr-1 h-3 w-3' />
          Filter
          {/* <CaretDownIcon /> */}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item shortcut='⌘ E'>Edit</DropdownMenu.Item>
        <DropdownMenu.Item shortcut='⌘ D'>Duplicate</DropdownMenu.Item>
        <DropdownMenu.Separator />
        {/* <DropdownMenu.Item shortcut='⌘ N'>Archive</DropdownMenu.Item> */}

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>More</DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item>Move to project…</DropdownMenu.Item>
            <DropdownMenu.Item>Move to folder…</DropdownMenu.Item>

            <DropdownMenu.Separator />
            <DropdownMenu.Item>Advanced options…</DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>

        <DropdownMenu.Separator />
        <DropdownMenu.Item>Share</DropdownMenu.Item>
        <DropdownMenu.Item>Add to favorites</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item shortcut='⌘ ⌫' color='red'>
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
