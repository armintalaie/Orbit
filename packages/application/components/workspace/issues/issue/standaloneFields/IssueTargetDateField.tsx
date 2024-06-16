import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { useIssueTargetDateField } from '@/lib/context/issues/issueFields';
import { UPDATE_ISSUE } from '@/lib/hooks/Issues/useMutateIssue';
import { useMutation } from '@apollo/client';
import { useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { DeadlineField } from '@/components/workspace/fields/deadlineField';

export function IssueTargetDateInput({ issueId, defaultValue }: { issueId: number; defaultValue?: string }) {
  const { form } = useIssueTargetDateField({ defaultValue });
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
      toast.error('Failed to update issue target date');
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
          name='targetDate'
          render={({ field }) => <IssueTargetDatePropertyField field={field} />}
        />
      </form>
    </Form>
  );
}

export function IssueTargetDatePropertyField({ field, compact = false }: { field: any; compact?: boolean }) {
  return (
    <FormItem className='flex w-full items-center gap-2 '>
      <div className={`flex w-full items-center gap-2 ${compact ? 'rounded-lg border' : ''}`}>
        {!compact && <span className='text-2xs w-20 font-normal'>Target Date</span>}
        <FormControl className='w-full'>
          <DeadlineField field={field} placeholder='target date' />
        </FormControl>
      </div>
      {/*<FormMessage />*/}
    </FormItem>
  );
}
