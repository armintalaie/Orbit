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
import { gql, useMutation } from '@apollo/client';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';

const DELETE_ISSUE = gql`
  mutation DeleteIssue($workspaceId: String!, $id: String!) {
    deleteIssue(workspaceId: $workspaceId, id: $id) {
      message
      status
    }
  }
`;

export default function IssueOptions({ issueId }: { issueId: number }) {
  const [deleteIssue, { data, loading, error }] = useMutation(DELETE_ISSUE);
  const { currentWorkspace } = useContext(OrbitContext);
  const router = useRouter();

  async function deleteIssueMutation() {
    deleteIssue({
      variables: {
        workspaceId: currentWorkspace,
        id: issueId.toString(),
      },
    }).then(() => {
      router.push(`/orbit/workspace/${currentWorkspace}`);
    });
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
          <Button variant='ghost' onClick={() => deleteIssueMutation()}>
            Delete Issue
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
