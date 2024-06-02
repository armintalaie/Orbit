import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { useMutation } from '@apollo/client';
import React, { useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { ControllerRenderProps } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { UPDATE_PROJECT } from '@/lib/utils/queries/project';
import { useProjectTitleField } from '@/lib/context/projects/projectFields';

type ProjectTitleFieldProps = {
  field: ControllerRenderProps<{ name: string }, 'name'>;
  projectId: string;
};

export function ProjectTitleInput({ projectId, defaultValue }: { projectId: string; defaultValue?: string }) {
  const { form } = useProjectTitleField({ defaultValue });
  const { workspace } = useContext(OrbitContext);
  const [updateProject, { error }] = useMutation(UPDATE_PROJECT);
  async function submitPatch(data: any) {
    await updateProject({
      variables: {
        workspaceId: workspace.id,
        project: data,
        id: projectId.toString(),
      },
    });
  }

  useEffect(() => {
    if (error) {
      toast.error('Failed to update project title');
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
          render={({ field }) => <ProjectTitlePropertyField field={field} projectId={projectId} />}
        />
      </form>
    </Form>
  );
}

function ProjectTitlePropertyField({ field, projectId }: ProjectTitleFieldProps) {
  return (
    <FormItem className='flex w-full flex-col  gap-2 '>
      <div className='flex w-full items-center gap-2'>
        <FormControl className='w-full'>
          <Input {...field} value={field.value} className='w-full border-transparent bg-inherit' />
        </FormControl>
        <div className='flex h-full items-center justify-center gap-2'>
          {/*<IssueOptions projectId={projectId} />*/}
        </div>
      </div>
      <FormMessage className='text-2xs' />
    </FormItem>
  );
}
