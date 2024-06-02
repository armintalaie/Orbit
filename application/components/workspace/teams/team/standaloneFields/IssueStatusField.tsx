import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { StatusField } from '@/components/workspace/fields/statusField';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { useIssueStatusField } from '@/lib/context/issues/issueFields';
import { UPDATE_ISSUE } from '@/lib/hooks/Issues/useMutateIssue';
import { useMutation } from '@apollo/client';
import { useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { ControllerRenderProps } from 'react-hook-form';

type IssueStatusFieldProps = {
  field: ControllerRenderProps<{ statusId: string | number }, 'statusId'>;
};

export function IssueStatusInput({ issueId, defaultValue }: { issueId: string; defaultValue?: string }) {
  const { form } = useIssueStatusField({ defaultValue });
  const { workspace } = useContext(OrbitContext);
  const [updateIssue, { error }] = useMutation(UPDATE_ISSUE);
  async function submitPatch(data: any) {
    await updateIssue({
      variables: {
        workspaceId: workspace.id,
        issue: data,
        id: issueId,
      },
    });
  }

  useEffect(() => {
    if (error) {
      toast.error('Failed to update issue status');
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
      <form>
        <FormField
          control={form.control}
          name='statusId'
          render={({ field }) => <IssueStatusPropertyField field={field} />}
        />
      </form>
    </Form>
  );
}

function IssueStatusPropertyField({ field }: IssueStatusFieldProps) {
  const { workspace } = useContext(OrbitContext);
  const statuses = workspace?.config.issueStatus || [];

  return (
    <FormItem className='flex w-full flex-col  gap-2 '>
      <div className='flex w-full items-center gap-2'>
        <span className='w-20 text-2xs font-normal'>Status</span>
        <FormControl className='w-full'>
          <StatusField field={field} statusOptions={statuses} placeholder='Select a status' />
        </FormControl>
      </div>
      <FormMessage className='text-2xs' />
    </FormItem>
  );
}
