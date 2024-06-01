'use client'; // top to the file

import { PlusIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useContext, useEffect, useState } from 'react';
import { FormField, FormItem, FormControl, FormMessage, Form } from '../../ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DeadlineField } from '../fields/deadlineField';
import { StatusField } from '../fields/statusField';
import { usePathname, useRouter } from 'next/navigation';

import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { formatUrl } from 'next/dist/shared/lib/router/utils/format-url';
import useLinkCreator from '@/lib/hooks/useLinkCreator';
// import IssueStatusField from './issue/fields/IssueStatusField';

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
      startDate
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
  startDate: z.string().optional(),
  targetDate: z.string().optional(),
  assignees: z.array(z.string()).optional(),
  projects: z.array(z.number()).optional(),
  content: z.string().optional().default(''),
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
  const { currentWorkspace } = useContext(OrbitContext);
  const [open, setOpen] = useState(false);
  const [createIssue, { data, loading, error }] = useMutation(NEW_ISSUE);

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
      setOpen(false);
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

  useEffect(() => {
    if (data) {
      form.reset();
    }
  }, [data]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        {button ? (
          <Button variant='outline' className='m-0 h-6 p-2 text-xs font-normal'>
            New Issue
          </Button>
        ) : (
          <button>
            <PlusIcon className='h-4 w-4' />
          </button>
        )}
      </SheetTrigger>
      <SheetContent className='w-full flex-1 '>
        <SheetHeader>
          <SheetTitle>New Issue</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex h-full w-full flex-1 flex-col gap-1 space-y-4 overflow-hidden px-2 py-4   '
          >
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

            <div className='flex w-full flex-col items-center gap-2  '></div>

            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem className='h-full w-full'>
                  <FormControl>
                    <Textarea
                      className='h-full resize-none'
                      placeholder='some details about this grand idea'
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex w-full flex-1 flex-col items-end justify-end '>
              <Button type='submit' className='w-full' onSubmit={form.handleSubmit(onSubmit)} onClick={onSubmit}>
                Create
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
