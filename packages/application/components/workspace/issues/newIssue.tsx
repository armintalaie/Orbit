'use client';

import { PlusIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useContext, useState } from 'react';
import { FormField, FormItem, FormControl, FormMessage, Form } from '../../ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePathname, useRouter } from 'next/navigation';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { Textarea } from '@/components/ui/textarea';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import useQueryStatus from '@/lib/hooks/common/useQueryStatus';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/themes';
import { IssueStatusPropertyField } from '@/components/workspace/issues/issue/standaloneFields/IssueStatusField';
import { IssueTargetDatePropertyField } from '@/components/workspace/issues/issue/standaloneFields/IssueTargetDateField';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IssueProjectPropertyField } from '@/components/workspace/issues/issue/standaloneFields/IssueProjectField';

const NEW_ISSUE = gql`
  mutation CreateIssue($workspaceId: String!, $issue: NewIssueInput!) {
    createIssue(workspaceId: $workspaceId, issue: $issue) {
      id
      title
      status {
        id
        name
      }
      targetDate
      assignees {
        id
        email
        profile {
          firstName
          lastName
          avatar
        }
      }
    }
  }
`;

export const formSchema = z.object({
  title: z.string().min(3).default(''),
  statusId: z.any().optional(),
  targetDate: z.string().optional(),
  assignees: z.array(z.string()).optional(),
  projectId: z.string().optional(),
  content: z.string().optional().default(''),
  teamId: z.string(),
});

export function NewIssue({
  defaultValues,
  button,
}: {
  button?: boolean;
  defaultValues?: Partial<z.infer<typeof formSchema>>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentWorkspace, workspace } = useContext(OrbitContext);
  const [open, setOpen] = useState(false);
  const [createIssue, { data, loading, error }] = useMutation(NEW_ISSUE);
  const queryStatus = useQueryStatus({ loading, error, data });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      statusId: '1',
    },
  });

  async function onSubmit() {
    const formVals = form.getValues();
    createIssue({ variables: { workspaceId: currentWorkspace, issue: formVals } }).then((value) => {
      toast.success('Issue created successfully', {
        action: {
          label: 'View',
          onClick: () => {
            // navigate to the issue
            const destination = `issues/${value.data.createIssue.id}`;
            router.push(`${pathname}/${destination}`);
          },
        },
      });
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {button ? (
          <Button variant='outline' className='m-0 h-6 p-2 text-xs font-normal'>
            New Issue
          </Button>
        ) : (
          <button>
            <PlusIcon className='h-4 w-4' />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className='w-full max-w-2xl flex-1 '>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex h-full w-full flex-1 flex-col gap-2  overflow-hidden p-2  '
          >
            <div className={'flex w-full items-center gap-2  p-1 '}>
              <FormField
                control={form.control}
                name='teamId'
                render={({ field }) => (
                  <FormItem className='text-2xs w-full max-w-24'>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={'team'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {workspace.teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormControl>
                      <Input placeholder='issue title' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className={'flex w-full items-center gap-2  p-1 '}>
              <FormField
                control={form.control}
                name='statusId'
                render={({ field }) => <IssueStatusPropertyField compact={true} field={field} />}
              />

              <FormField
                control={form.control}
                name='targetDate'
                render={({ field }) => <IssueTargetDatePropertyField compact={true} field={field} />}
              />

              <FormField
                control={form.control}
                name='projectId'
                render={({ field }) => (
                  <IssueProjectPropertyField projectOptions={workspace.projects} compact={true} field={field} />
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem className='h-full w-full'>
                  <FormControl>
                    <Textarea
                      className='h-full min-h-40 resize-none border-transparent text-sm'
                      placeholder='...details'
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex w-full flex-1 flex-col items-end justify-end '>
              <Button
                status={queryStatus}
                type='submit'
                className='w-full'
                onSubmit={form.handleSubmit(onSubmit)}
                onClick={onSubmit}
              >
                Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
