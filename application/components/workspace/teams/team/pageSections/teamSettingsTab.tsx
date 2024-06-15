"use client";
import { Button } from '@/components/ui/button';
import {gql, useMutation} from "@apollo/client";
import useQueryStatus from "@/lib/hooks/common/useQueryStatus";
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';

const DELETE_TEAM = gql`
    mutation DeleteTeam($id: String!, $workspaceId: String!) {
        deleteTeam(id: $id, workspaceId: $workspaceId) {
          status
          message 
        }
    }`;



export default function TeamSettingsTab({ team }: { team: any }) {
    const [deleteTeam, {loading, error, data}] = useMutation(DELETE_TEAM);
    const {currentWorkspace} = useContext(OrbitContext)
    const queryStatus = useQueryStatus({loading, error, data});
    const router = useRouter();

    async function onDeleteTeam() {
        const res = await deleteTeam({
            variables: {
                id: team.id,
                workspaceId: currentWorkspace
            }
        });
        if (res.data.deleteTeam.status === 'success') {
            router.replace('/orbit');
            
        }
    }
  return (
    <div className='flex h-full flex-1 flex-col gap-4 p-1 px-4'>
      <div className='flex flex-row items-center justify-between'>
        <h1 className='text-md medium'>Settings</h1>
      </div>
      <div className='flex h-full flex-1 flex-col gap-4'>
        <div className='flex flex-1 flex-col gap-5'>
        </div>
        <div className='secondary-surface flex flex-col gap-5 rounded border p-2'>
          <p className={'text-xs'}>Deleting a team is irreversible. All private projects and tasks will be deleted.</p>
          <div className='flex w-full  items-center justify-end'>
            <Button status={queryStatus} variant='destructive' size='xs' onClick={onDeleteTeam}>
              Close Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
