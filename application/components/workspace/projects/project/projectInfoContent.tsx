import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { dateFormater } from '@/lib/util';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { BadgeInfoIcon } from 'lucide-react';
import { DeadlineField } from '../../fields/deadlineField';
import { useContext, useMemo } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ProjectStatusField from './fields/projectStatusField';
import { gql, useMutation } from '@apollo/client';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';

type ProjectInfoContentProps = {
  project: {
    id: string;
    name: string;
    description: string;
    status: { id: string; name: string };
    targetDate: string;
    startDate: string;
    meta: string;
  };
  pid: string;
  wid: string;
};

export default function ProjectInfoContent({ project, pid, wid }: ProjectInfoContentProps) {
  console.log(wid, pid, project);
  return (
    <div className=' flex h-full w-full flex-1 flex-col overflow-hidden'>
      <div className='flex h-12 w-full items-center justify-between border-b  p-4 px-4'>
        {/*<BadgeInfoIcon className='h-4 w-4' />*/}
      </div>
      <div className='flex h-full  w-full border-b   p-4 py-3 '>
        <div className='flex  w-full flex-col  gap-3'>
          {/*<ProjectProperties wid={wid} pid={pid} project={project} />*/}
        </div>
      </div>
    </div>
  );
}

function ProjectProperties({ wid, pid, project }: { wid: string; pid: string; project: any }) {
  const { workspace } = useContext(OrbitContext);
  const statuses = workspace?.config.projectStatus || [];
  const defaults = useMemo(() => {
    return {
      statusId: project.status.id,
      startDate: project.startDate,
      targetDate: project.targetDate,
      description: project.description,
    };
  }, [project, statuses]);

  const [updateProject, { data, loading, error }] = useMutation(UPDATE_PROJECT);
  const formSchema = z.object({
    statusId: z.string().optional(),
    startDate: z.string().optional(),
    targetDate: z.string().optional(),
    description: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaults,
  });

  const onSubmit = async () => {
    console.log(form.getValues());
    await updateProject({
      variables: {
        workspaceId: wid,
        id: pid,
        project: form.getValues(),
      },
    });
  };

  return (
    <div className='flex flex-col gap-4'>
      <span className='text-xs font-medium'>Properties</span>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onChange={() => {
            console.log(form.getValues());
          }}
          className='flex h-full w-full flex-1 flex-col gap-1  overflow-hidden '
        >
          <FormField
            control={form.control}
            name='statusId'
            render={({ field }) => (
              <FormItem className='flex w-full items-center gap-2 '>
                <span className='w-20 text-2xs font-normal'>Status</span>
                <FormControl className='w-full'>
                  <ProjectStatusField field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='startDate'
            render={({ field }) => (
              <FormItem className='flex w-full items-center gap-2 '>
                <span className='w-20 text-2xs font-normal'>Start date</span>
                <FormControl className='w-full'>
                  <DeadlineField field={field} placeholder='Start date' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='targetDate'
            render={({ field }) => (
              <FormItem className='flex w-full items-center gap-2 '>
                <span className='w-20 text-2xs font-normal'>Target date</span>
                <FormControl className='w-full'>
                  <DeadlineField field={field} placeholder='Target date' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button type='submit'>Save</button>
        </form>
      </Form>
    </div>
  );
}

const UPDATE_PROJECT = gql`
  mutation UpdateProject($workspaceId: String!, $id: String!, $project: UpdateProjectInput!) {
    updateProject(project: $project, id: $id, workspaceId: $workspaceId) {
      id
      name
      description
      status
      targetDate
      startDate
      meta
    }
  }
`;
