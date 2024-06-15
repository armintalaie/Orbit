'use client';
import { z } from 'zod';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';

const CREATE_WORKSPACE = gql`
  mutation createWorkspace($workspace: NewWorkspaceInput!) {
    createWorkspace(workspace: $workspace) {
      id
      name
      updatedAt
    }
  }
`;

const schema = z.object({
  name: z
    .string()
    .regex(/^[a-zA-Z0-9 ]+$/, 'Workspace names can only contain letters, numbers and spaces')
    .min(3)
    .max(50),
});

export default function NewWorkspaceModal() {
  const [createWorkspaceRequest] = useMutation(CREATE_WORKSPACE);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
    },
  });

  async function createWorkspace() {
    createWorkspaceRequest({
      variables: {
        workspace: {
          name: form.getValues('name'),
        },
      },
    }).then((res) => {
      if (res.data?.createWorkspace) {
        toast('Workspace created');
      } else {
        toast('Failed to create workspace');
      }
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'xs'}>Create Workspace</Button>
      </DialogTrigger>
      <DialogContent className={''}>
        <DialogHeader>
          <h2 className='text-lg font-semibold'>Create a new workspace</h2>
        </DialogHeader>
        <Form {...form}>
          <form className=' flex w-full flex-col gap-4 rounded-md  ' onSubmit={form.handleSubmit(createWorkspace)}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='w-full flex-col gap-5 space-y-4'>
                  <FormControl>
                    <Input placeholder='workspace name' {...field} />
                  </FormControl>
                  <FormDescription className={'text-xs text-gray-500'}>
                    Workspace names must be unique and can only contain letters, numbers and spaces.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex w-full justify-end gap-2'>
              <Button type={'submit'}>Create</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
