import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { useIssueTitleField } from '@/lib/context/issues/issueFields';
import { UPDATE_ISSUE } from '@/lib/hooks/Issues/useMutateIssue';
import { useMutation } from '@apollo/client';
import React, { useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { ControllerRenderProps } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import IssueOptions from '@/components/workspace/issues/issue/details/IssueOptions';

type IssueTitleFieldProps = {
  field: ControllerRenderProps<{ title: string }, 'title'>;
  issueId: number;
};

export function IssueTitleInput({ issueId, defaultValue }: { issueId: number; defaultValue?: string }) {
  const { form } = useIssueTitleField({ defaultValue });
  const { workspace } = useContext(OrbitContext);
  const [updateIssue, { error }] = useMutation(UPDATE_ISSUE);
  async function submitPatch(data: any) {
    await updateIssue({
      variables: {
        workspaceId: workspace.id,
        issue: data,
        id: issueId.toString(),
      },
    });
  }

  useEffect(() => {
    if (error) {
      toast.error('Failed to update issue title');
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
          name='title'
          render={({ field }) => <IssueTitlePropertyField field={field} issueId={Number(issueId)} />}
        />
      </form>
    </Form>
  );
}

function IssueTitlePropertyField({ field, issueId }: IssueTitleFieldProps) {
  return (
    <FormItem className='flex w-full flex-col  gap-2 '>
      <div className='flex w-full items-center gap-2'>
        <FormControl className='w-full'>
          <Input {...field} value={field.value} className='w-full border-transparent bg-inherit' />
        </FormControl>
        <div className='flex h-full items-center justify-center gap-2'>
          <IssueOptions issueId={issueId} />
        </div>
      </div>
    </FormItem>
  );
}
