'use client'; // top to the file

import { PlusIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@uidotdev/usehooks';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useContext, useState } from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from './ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DeadlineField } from './issues/form/deadlineField';
import { StatusField } from './issues/form/statusField';
import { Textarea } from '@/components/ui/textarea';
import { AssigneeField } from './issues/form/assigneeField';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { LabelField } from './issues/form/labelField';
import { ProjectField } from './issues/form/projectField';
import { IIssue } from '@/lib/types/issue';
import { OrbitContext } from '@/lib/context/OrbitContext';
export const issueSchema = z.object({
  title: z.string(),
  contents: z.string(),
  statusid: z.number(),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  assignee: z.array(z.string()),
});

export const formSchema = z.object({
  title: z.string(),
  contents: z.string(),
  statusid: z.number(),
  deadline: z.date().nullable(),
  labels: z.array(z.string()),
  assignee: z.string().nullable(),
  projectid: z.number(),
});

export function NewIssue({
  onIssueUpdate,
  defaultValues,
  button,
}: {
  defaultValues?: object;
  button?: boolean;
  onIssueUpdate?: (issue: IIssue) => void;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  function close() {
    setOpen(false);
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className='m-0 p-0'>
          {button ? (
            <Button
              variant='outline'
              className='m-0 h-6 p-2 text-xs font-normal dark:border-neutral-900 dark:bg-neutral-800 dark:text-neutral-300 '
            >
              New Issue
            </Button>
          ) : (
            <Button
              className='m-0 mt-0 flex h-fit w-fit items-center space-y-0 p-0'
              variant='outline'
            >
              <PlusIcon className='h-4 w-4' />
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className='sm:max-w-3xl'>
          <DialogHeader>
            <DialogTitle>New Issue</DialogTitle>
            <DialogDescription>Create a new Issue.</DialogDescription>
          </DialogHeader>
          <NewIssueForm
            defaultValues={defaultValues}
            onIssueUpdate={onIssueUpdate}
            close={close}
          />

          <DialogFooter className='sm:justify-start'>
            <DialogClose asChild></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild className='m-0 p-0'>
        {button ? (
          <Button variant='outline' className='m-0 h-6 p-2 text-xs font-normal'>
            New Issue
          </Button>
        ) : (
          <button className='m-0 flex h-fit w-fit items-center p-0'>
            <PlusIcon className='h-4 w-4' />
          </button>
        )}
      </DrawerTrigger>
      <DrawerContent className='max-h-[90%] px-3 '>
        <DrawerHeader className='text-left'>
          <DrawerTitle>New Issue</DrawerTitle>
          <DrawerDescription>Create a new Issue.</DrawerDescription>
        </DrawerHeader>
        <NewIssueForm
          defaultValues={defaultValues}
          onIssueUpdate={onIssueUpdate}
          close={close}
        />
        <DrawerFooter className='pt-2'>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function NewIssueForm({
  defaultValues,
  onIssueUpdate,
  close,
}: {
  defaultValues?: object;
  close: Function;
  onIssueUpdate?: (issue: IIssue) => void;
}) {
  const [labels, setLabels] = useState([]);
  const { fetcher } = useContext(OrbitContext);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      statusid: 1,
      contents: '',
      deadline: null,
      assignee: null,
      labels: [],
      ...defaultValues,
    },
  });
  async function onSubmit() {
    const formVals = form.getValues();
    const issue = {
      title: formVals.title,
      contents: formVals.contents,
      statusid: formVals.statusid,
      deadline: formVals.deadline
        ? formVals.deadline.toISOString().split('T')[0]
        : undefined,
      assignees: formVals.assignee ? [formVals.assignee] : [],
      labels: labels,
      projectid: formVals.projectid || undefined,
    };
    const URL = `/api/issues`;
    const res = await fetcher(`${URL}`, {
      body: JSON.stringify(issue),
      headers: {
        'Content-Type': 'application/json',
        'X-Full-Object': 'true',
      },
      method: 'POST',
    });

    if (!res.ok) {
      toast('Issue not created', {
        description: 'something went wrong',
      });
    } else {
      close();
      const issue = (await res.json()) as IIssue;
      onIssueUpdate && onIssueUpdate(issue);
      toast('Issue created', {
        description: `Issue successfully created`,
      });
    }
  }

  return (
    <div className='flex flex-col gap-4 overflow-y-scroll px-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Next big thing start with the little things...'
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='contents'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder='Add some details about the issue or add them later...'
                    id='message-2'
                    className='h-30 resize-none'
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex flex-row flex-wrap gap-1'>
            <FormField
              control={form.control}
              name='statusid'
              render={({ field }) => (
                <FormItem className='p-0'>
                  <FormControl>
                    <StatusField {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='projectid'
              render={({ field }) => (
                <FormItem className='p-0'>
                  <FormControl>
                    <ProjectField field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='assignee'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AssigneeField field={field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='deadline'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DeadlineField field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='labels'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <LabelField
                      {...field}
                      setFields={(val: any) => {
                        setLabels(val);
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type='submit' className='w-full'>
            Create
          </Button>
        </form>
      </Form>
    </div>
  );
}
