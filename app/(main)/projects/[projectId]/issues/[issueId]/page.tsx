'use client';

import { NewIssue } from '@/components/newIssue';
import { CardHeader, CardContent } from '@/components/ui/card';
import { dateFormater, isOverdue } from '@/lib/util';
import {
  TableIcon,
  BoxIcon,
  DotsVerticalIcon,
  DotsHorizontalIcon,
} from '@radix-ui/react-icons';
import {
  Badge,
  Button,
  Heading,
  Box,
  Text,
  ContextMenu,
  Table,
} from '@radix-ui/themes';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FilterIcon } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import TextEditor from '@/components/editor/textEditor';
import { useRouter } from 'next/router';

export default function IssuePage() {
  const router = useParams();
  const { projectId, issueId } = router;
  const [issue, setIssue] = useState(undefined);
  async function fetchIssue() {
    const res = await fetch(`/api/projects/${projectId}/issues/${issueId}`);
    const resultIssue = await res.json();
    setIssue(resultIssue);
  }

  useEffect(() => {
    fetchIssue();
  }, []);

  if (!issue) return <div>Loading...</div>;

  return (
    <div className='flex min-h-screen w-full flex-col'>
      <div className='flex h-full w-full'>
        <div className=' flex h-full w-full flex-1 flex-col '>
          <div className='flex h-12 w-full items-center justify-between p-4  px-4 '>
            <div className='flex flex-row items-center gap-2'>
              <h1 className='text-md h-full pr-2 font-medium leading-tight text-gray-700'>
                {issue.title}
              </h1>
              {/* <ProjectOptions projectId={issue.id} /> */}
            </div>
            <div className='flex h-full items-center justify-center gap-2'></div>
          </div>

          <div className=' flex h-full w-full flex-1 flex-col bg-gray-50 '>
            <div className='flex h-12 flex-row items-center justify-between border-y border-gray-100 bg-white p-2 py-3'></div>
            <div className=' flex h-full flex-grow flex-col'>
              <TextEditor />
            </div>
          </div>
        </div>

        <div className=' flex h-full w-80 flex-col border-l border-gray-100 bg-white '>
          <div className='flex h-12 w-full items-center justify-between bg-white  p-4 px-4 '></div>
          <div className=' flex h-full w-full flex-1 flex-col bg-white '>
            <div className='flex h-full flex-col justify-between gap-3 border-t border-gray-100 bg-white p-2 py-3'>
              <div className='flex h-6 flex-row items-center gap-2'>
                <p className='w-24 items-center  pr-2 text-xs font-medium leading-tight text-gray-700'>
                  Deadline
                </p>
                <p className='items-center   pr-2 text-xs font-medium leading-tight text-gray-700'>
                  {isOverdue(issue.deadline) ? (
                    <Badge color='red'>{dateFormater(issue.deadline)}</Badge>
                  ) : (
                    <Badge color='gray'> {dateFormater(issue.deadline)}</Badge>
                  )}
                </p>
              </div>

              <div className='flex h-6 flex-row items-center gap-2'>
                <p className='w-24 items-center  pr-2 text-xs font-medium leading-tight text-gray-700'>
                  Status
                </p>
                <p className='items-center  pr-2 text-xs font-medium leading-tight text-gray-700'>
                  {issue.statusid}
                </p>
              </div>

              <div className='flex h-6 flex-row items-center gap-2'>
                <p className='w-24 items-center  pr-2 text-xs font-medium leading-tight text-gray-700'>
                  Project
                </p>
                <p className='items-center  pr-2 text-xs font-medium leading-tight text-gray-700'>
                  {issue.projectid}
                </p>
              </div>

              <div className='flex h-6 flex-row items-center gap-2'>
                <p className='w-24 items-center  pr-2 text-xs font-medium leading-tight text-gray-700'>
                  Status
                </p>
                <p className='items-center  pr-2 text-xs font-medium leading-tight text-gray-700'>
                  {issue.statusid}
                </p>
              </div>
              <div className='flex h-full items-center justify-center gap-2'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task }) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <Link href={`/projects/1/issues/${task.id}`} aria-disabled={true}>
          <Box className='flex flex-col gap-2 rounded-sm border border-gray-200 bg-white  p-2 shadow-sm hover:shadow-md'>
            <div className='flex w-full flex-row justify-between gap-2 py-0'>
              <Text size='1' className='text-gray-600'>
                #{task.id}
              </Text>
              {task.priority != 0 && (
                <Badge color='gray'>{'!'.repeat(task.priority)}</Badge>
              )}
            </div>
            <Text size='2' className='p-0 font-semibold  text-gray-700'>
              {task.name}
            </Text>

            <div className='flex w-full flex-row justify-between gap-2'>
              <Text size='1' className='font-semibold text-gray-500 '>
                Unassigned
              </Text>
              {isOverdue(task.deadline) ? (
                <Badge color='red'>{dateFormater(task.deadline)}</Badge>
              ) : (
                <Badge color='gray'> {dateFormater(task.deadline)}</Badge>
              )}
            </div>
          </Box>
        </Link>
        {/* <RightClickZone style={{ height: 150 }} /> */}
      </ContextMenu.Trigger>
      <ContextMenu.Content size='2'>
        {/* <ContextMenu.Item shortcut="⌘ E">Edit</ContextMenu.Item> */}
        <ContextMenu.Item shortcut='⌘ D'>Duplicate</ContextMenu.Item>
        <ContextMenu.Separator />
        {/* <ContextMenu.Item shortcut='⌘ N'>Archive</ContextMenu.Item> */}
        <ContextMenu.Item>Move to project…</ContextMenu.Item>

        <ContextMenu.Sub>
          <ContextMenu.SubTrigger>More</ContextMenu.SubTrigger>
          <ContextMenu.SubContent>
            <ContextMenu.Separator />
            <ContextMenu.Item>Advanced options…</ContextMenu.Item>
          </ContextMenu.SubContent>
        </ContextMenu.Sub>

        <ContextMenu.Separator />
        <ContextMenu.Item>Share</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item shortcut='⌘ ⌫' color='red'>
          Delete
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}

function TableView({ tasks }) {
  const groupedTasks = groupByStatus(tasks);
  // console.log(tasks);
  function groupByStatus(tasks) {
    const grouped = tasks.reduce((acc, task) => {
      if (!acc[task.statusid]) {
        acc[task.statusid] = [];
      }
      acc[task.statusid].push(task);
      return acc;
    }, {});
    return Object.keys(grouped).map((statusid) => ({
      statusid: statusid,
      tasks: grouped[statusid],
    }));
  }

  console.log(groupedTasks);
  return (
    <div className='flex h-full w-full flex-col '>
      <Table.Root className='w-full  overflow-hidden rounded-sm border-gray-200 bg-white shadow-none'>
        <Table.Body>
          {groupedTasks.map((taskType) => (
            // <Table.RowGroup key={taskType.status}>
            <>
              <Table.Row className='bg-gray-50  '>
                <Table.Cell colSpan={5}>
                  <Heading size='3'>{taskType.statusid}</Heading>
                </Table.Cell>
              </Table.Row>
              {taskType.tasks.map((task) => (
                <Table.Row key={task.id}>
                  <Table.RowHeaderCell>{task.name}</Table.RowHeaderCell>
                  <Table.Cell>Jake J</Table.Cell>
                  <Table.Cell>
                    {task.priority != 0 && (
                      <Badge color='gray'>{'!'.repeat(task.priority)}</Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {isOverdue(task.deadline) ? (
                      <Badge color='red'>{dateFormater(task.deadline)}</Badge>
                    ) : (
                      <Badge color='gray'> {dateFormater(task.deadline)}</Badge>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
              <Table.Row className='bg-gray-50  '>
                <Table.Cell colSpan={5}>
                  <NewIssue button={false} />
                </Table.Cell>
              </Table.Row>
            </>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}

function KanbanView({ tasks }) {
  const groupedTasks = groupByStatus(tasks);
  // console.log(tasks);
  function groupByStatus(tasks) {
    const grouped = tasks.reduce((acc, task) => {
      if (!acc[task.statusid]) {
        acc[task.statusid] = [];
      }
      acc[task.statusid].push(task);
      return acc;
    }, {});
    return Object.keys(grouped).map((statusid) => ({
      statusid: statusid,
      tasks: grouped[statusid],
    }));
  }

  return (
    <div className='flex h-full flex-1 flex-row gap-8 p-4 px-2'>
      {groupedTasks.map((task) => (
        <div key={task.statusid}>
          <div className='h-full w-72 rounded-sm p-0 '>
            <CardHeader className='flex flex-row items-center justify-between px-1'>
              <Heading size='3'>{task.statusid}</Heading>
              <NewIssue button={false} />
            </CardHeader>

            <CardContent className='flex-1 overflow-y-auto p-0'>
              <ul className='space-y-3'>
                {task.tasks.map((task) => (
                  <li key={task.id}>
                    <TaskCard task={task} />
                  </li>
                ))}
              </ul>
            </CardContent>
          </div>
        </div>
      ))}
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
        <DropdownMenu.Item shortcut='⌘ N'>Archive</DropdownMenu.Item>

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

function ProjectOptions({ projectId }: { projectId: string }) {
  const router = useRouter();

  async function deleteProject() {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error(res.statusText);
    router.push('/projects');
  }

  async function archiveProject() {
    const res = await fetch(`/api/projects/${projectId}/archive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error(res.statusText);
    router.push('/projects');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost'>
          <DotsHorizontalIcon className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>Project Settings</DropdownMenuLabel>

        {/* <DropdownMenuSub>
          <DropdownMenuSubTrigger>Archive project</DropdownMenuSubTrigger>
        </DropdownMenuSub> */}

        <DropdownMenuSeparator />

        {/* <DropdownMenuGroup> */}
        {/* <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuSubTrigger>Members</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub> */}
        {/* </DropdownMenuGroup> */}
        {/* <DropdownMenuSeparator /> */}

        <DropdownMenuItem>
          <Button variant='ghost' onClick={() => deleteProject()}>
            Delete project
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
