import router from 'next/router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { CheckIcon, PencilLine, XIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function IssueTitleField({
  issueId,
  issueTitle,
  projectId,
}: {
  issueId: number;
  issueTitle: string;
  projectId: number;
}) {
  const [showEditButton, setShowEditButton] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [title, setIssueTitle] = useState(issueTitle);

  function saveTitleChanges() {
    if (title === issueTitle) {
      toast('No changes made');
      return;
    }
    const operation = setTimeout(async () => {
      await fetch(`/api/issues/${issueId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
        }),
      });
    }, 4000);

    toast('Title updated', {
      duration: 3000,
      action: {
        label: 'Undo',
        onClick: () => clearTimeout(operation),
      },
    });
    setEditMode(false);
  }

  return (
    <>
      <div className='flex h-full w-full flex-row items-center gap-2'>
        <div
          className='flex h-full w-full flex-row items-center gap-2'
          onMouseEnter={() => setShowEditButton(true)}
          onMouseLeave={() => setShowEditButton(false)}
        >
          {editMode && (
            <Button
              variant='outline'
              className='m-0 p-2'
              onClick={() => {
                setEditMode(false);
                setIssueTitle(issueTitle);
              }}
            >
              <XIcon className='h-4 w-4 ' />
            </Button>
          )}

          {!editMode ? (
            <Button
              className='hover:border hover:border-dashed hover:border-gray-700 hover:bg-gray-100'
              onClick={() => setEditMode(true)}
              variant='ghost'
            >
              <h1 className='text-md pr-2 font-medium leading-tight text-gray-700'>
                {title}
              </h1>
              {showEditButton && (
                <PencilLine className='h-4 w-4 text-gray-700' />
              )}
            </Button>
          ) : (
            <input
              type='text'
              className='text-md m-0 h-full w-full rounded-md  border border-dashed border-gray-700 pl-2 pr-2 font-medium leading-tight text-gray-700 outline-none'
              value={title}
              onChange={(e) => {
                setIssueTitle(e.target.value);
              }}
            />
          )}
        </div>

        {editMode ? (
          <Button
            variant='outline'
            className='m-0 p-2'
            onClick={() => saveTitleChanges()}
          >
            <CheckIcon className='h-4 w-4' />
          </Button>
        ) : (
          <IssueOptions issueId={issueId} projectId={projectId} />
        )}
      </div>
      <div className='flex h-full items-center justify-center gap-2'></div>
    </>
  );
}

function IssueOptions({
  issueId,
  projectId,
}: {
  issueId: number;
  projectId: number;
}) {
  async function deleteIssue() {
    const res = await fetch(`/api/issue/${issueId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error(res.statusText);
    router.push(`/projects/${projectId}`);
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
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button variant='ghost' onClick={() => deleteIssue()}>
            Delete Issue
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
