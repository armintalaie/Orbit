import router from 'next/router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { CheckIcon, PencilLine, XIcon } from 'lucide-react';
import { useContext, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { OrbitContext } from '@/lib/context/OrbitContext';

export default function ProjectTitleField({
  projectTitle,
  projectId,
  teamid,
}: {
  projectTitle: string;
  projectId: number;
  teamid?: number;
}) {
  const [editMode, setEditMode] = useState(false);
  const [title, setProjectTitle] = useState(projectTitle);
  const { fetcher } = useContext(OrbitContext);

  function saveTitleChanges() {
    if (title === projectTitle) {
      toast('No changes made');
      return;
    }
    const operation = setTimeout(async () => {
      await fetcher(`/api/projects/${projectId}`, {
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
        <div className='flex h-full w-full flex-row items-center gap-2'>
          {editMode && (
            <Button
              variant='outline'
              className='m-0 p-2'
              onClick={() => {
                setEditMode(false);
                setProjectTitle(projectTitle);
              }}
            >
              <XIcon className='h-4 w-4 ' />
            </Button>
          )}

          {!editMode ? (
            <Button
              className='px-0 hover:border hover:border-dashed hover:border-gray-700 hover:bg-gray-100'
              onClick={() => setEditMode(true)}
              variant='ghost'
            >
              <h1 className='text-md pr-2 font-medium leading-tight text-gray-700 dark:text-neutral-200'>
                {title}
              </h1>
            </Button>
          ) : (
            <input
              type='text'
              className='text-md m-0 h-full w-full rounded-md  border border-dashed border-gray-700 pl-2 pr-2 font-medium leading-tight text-gray-700 outline-none'
              value={title}
              onChange={(e) => {
                setProjectTitle(e.target.value);
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
          <ProjectOptions projectId={projectId} teamid={teamid} />
        )}
      </div>
      <div className='flex h-full items-center justify-center gap-2'></div>
    </>
  );
}

function ProjectOptions({
  projectId,
  teamid,
}: {
  projectId: number;
  teamid?: number;
}) {
  const router = useRouter();
  const { fetcher, reload } = useContext(OrbitContext);

  async function deleteProject() {
    const res = await fetcher(`/api/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    reload(['projects']);

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
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* <DropdownMenuItem>
              {teamid ? (
                <Button variant='ghost' onClick={() => archiveProject()}>
                  Change Team
                </Button>
              ) : (
                <Button variant='ghost' onClick={() => archiveProject()}>
                  Assign Team
                </Button>
              )}
            </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button variant='ghost' onClick={() => deleteProject()}>
            Delete project
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
