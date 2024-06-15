import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { useIssueProjectField } from '@/lib/context/issues/issueFields';
import { UPDATE_ISSUE } from '@/lib/hooks/Issues/useMutateIssue';
import { useMutation } from '@apollo/client';
import { useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { ControllerRenderProps } from 'react-hook-form';
import {ProjectField} from "@/components/workspace/fields/projectField";

type IssueStatusFieldProps = {
  field: ControllerRenderProps<{ projectId: string | number }, 'projectId'>;
  compact?: boolean;
  projectOptions?: { id: string | number; name: string }[];
};

export function IssueProjectInput({ projectId, defaultValue }: { projectId: string; defaultValue?: string }) {
  const { form } = useIssueProjectField({ defaultValue });
  const { workspace } = useContext(OrbitContext);
  const [updateIssue, { error }] = useMutation(UPDATE_ISSUE);
  async function submitPatch(data: any) {
    await updateIssue({
      variables: {
        workspaceId: workspace.id,
        issue: data,
        id: projectId,
      },
    });
  }

  useEffect(() => {
    if (error) {
      toast.error('Failed to update issue project');
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
          name='projectId'
          render={({ field }) => <IssueProjectPropertyField field={field} />}
        />
      </form>
    </Form>
  );
}

export function IssueProjectPropertyField({ field, compact = false, projectOptions }: IssueStatusFieldProps) {
  const projects = projectOptions || [];

  return (
    <FormItem className='flex w-full flex-col  gap-2 '>
      <div className={`flex w-full items-center gap-2 ${compact ? 'rounded-lg border' : ''}`}>
        {!compact && <span className='w-20 text-2xs font-normal'>Project</span>}
        <FormControl className='w-full'>
          <ProjectField field={field} placeholder='select a project' projectOptions={projects} />
        </FormControl>
        <FormMessage />
      </div>
    </FormItem>
  );
}
