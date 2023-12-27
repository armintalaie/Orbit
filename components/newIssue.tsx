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
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
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
export const issueSchema = z.object({
  title: z.string(),
  contents: z.object({
    body: z.string(),
  }),
  statusid: z.number(),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  datestarted: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  assignee: z.array(z.string()),
});

export const formSchema = z.object({
  title: z.string(),
  body: z.string(),
  statusid: z.number(),
  deadline: z.object({
    from: z.date(),
    to: z.date(),
  }),
  assignee: z.string().nullable(),
});

export function NewIssue({
  projectid,
  button,
  reload,
}: {
  projectid?: number;
  button?: boolean;
  reload: Function;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  function close() {
    setOpen(false);
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {projectid &&
            (button ? (
              <Button variant='outline' className='m-0 h-6 p-2 text-xs'>
                New Issue
              </Button>
            ) : (
              <button>
                <PlusIcon className='h-4 w-4' />
              </button>
            ))}
        </DialogTrigger>
        <DialogContent className='sm:max-w-3xl'>
          <DialogHeader>
            <DialogTitle>New Issue</DialogTitle>
            <DialogDescription>Create a new Issue.</DialogDescription>
          </DialogHeader>
          <NewIssueForm projectid={projectid} reload={reload} close={close} />

          <DialogFooter className='sm:justify-start'>
            <DialogClose asChild></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {projectid &&
          (button ? (
            <Button variant='outline' className='m-0 h-6 p-2 text-xs'>
              New Issue
            </Button>
          ) : (
            <button>
              <PlusIcon className='h-4 w-4' />
            </button>
          ))}
      </DrawerTrigger>
      <DrawerContent className='max-h-[90%] px-3 '>
        <DrawerHeader className='text-left'>
          <DrawerTitle>New Issue</DrawerTitle>
          <DrawerDescription>Create a new Issue.</DrawerDescription>
        </DrawerHeader>
        <NewIssueForm projectid={projectid} reload={reload} close={close} />

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
  projectid,
  reload,
  close,
}: {
  projectid?: number;
  reload: Function;
  close: Function;
}) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      statusid: 1,
      body: '',
      deadline: {
        from: new Date(),
        to: new Date(),
      },
      assignee: null,
    },
  });
  async function onSubmit(e) {
    const formVals = form.getValues();
    const issue = {
      title: formVals.title,
      contents: {
        body: formVals.body,
      },
      statusid: formVals.statusid,
      deadline: formVals.deadline.to.toISOString().split('T')[0],
      datestarted: formVals.deadline.from.toISOString().split('T')[0],
      assignee: formVals.assignee || null,
    };
    const URL = projectid ? `/api/projects/${projectid}/issues` : `/api/issues`;
    const res = await fetch(`${URL}`, {
      body: JSON.stringify(issue),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!res.ok) {
      toast({
        title: 'Issue not created',
        description: 'something went wrong',
      });
    } else {
      reload();
      toast({
        title: 'Issue created',
        description: `Issue successfully created`,
      });
      // setOpen(false);
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
            name='body'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contents</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Add some details about the issue or add them later...'
                    id='message-2'
                    className='h-60 resize-none'
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex flex-row flex-wrap gap-6'>
            <FormField
              control={form.control}
              name='statusid'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <StatusField {...field} />
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
              name='assignee'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AssigneeField field={field} projectid={projectid} />
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
