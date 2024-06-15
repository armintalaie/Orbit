import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { useMutation } from '@apollo/client';
import React, { useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { ControllerRenderProps } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { useTeamNameField } from '@/lib/hooks/teams/teamFields';
import { UPDATE_TEAM } from '@/lib/utils/queries/team';

type TeamTitleFieldProps = {
  field: ControllerRenderProps<{ name: string }, 'name'>;
  teamId: string;
};

export function TeamNameInput({ teamId, defaultValue }: { teamId: string; defaultValue?: string }) {
  const { form } = useTeamNameField({ defaultValue });
  const { workspace } = useContext(OrbitContext);
  const [updateProject, { error }] = useMutation(UPDATE_TEAM);
  async function submitPatch(data: any) {
    await updateProject({
      variables: {
        workspaceId: workspace.id,
        team: data,
        id: teamId.toString(),
      },
    });
  }

  useEffect(() => {
    if (error) {
      toast.error('Failed to update team name');
    }
  }, [error]);

  useEffect(() => {
    const sub = form.watch((_, { type }) => {
      if (type === 'change') {
        form.handleSubmit(submitPatch)();
      }
    });
    return () => sub.unsubscribe();
  }, [form.watch]);

  return (
    <Form {...form}>
      <form className={'w-full'}>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => <TeamTitlePropertyField field={field} teamId={teamId} />}
        />
      </form>
    </Form>
  );
}

function TeamTitlePropertyField({ field, teamId }: TeamTitleFieldProps) {
  return (
    <FormItem className='flex w-full flex-col  gap-2 '>
      <div className='flex w-full items-center gap-2'>
        <FormControl className='w-full'>
          <Input {...field} value={field.value} className='w-full border-transparent bg-inherit' />
        </FormControl>
        <div className='flex h-full items-center justify-center gap-2'></div>
      </div>
    </FormItem>
  );
}
