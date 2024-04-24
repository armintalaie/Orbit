import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useContext } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { OrbitContext } from '@/lib/context/OrbitContext';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

export default function TeamOptions({ teamId }: { teamId: string }) {
  const { reload, fetcher } = useContext(OrbitContext);
  const router = useRouter();
  async function deleteProject() {
    const res = await fetcher(`/api/teams/${teamId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    reload(['teams']);
    if (!res.ok) throw new Error(res.statusText);

    router.push('/teams');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost'>
          <DotsHorizontalIcon className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>Team Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button variant='ghost' onClick={() => deleteProject()}>
            Delete team
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
