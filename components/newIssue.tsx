'use client'; // top to the file

import { PlusIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
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
  projectid: number;
  button?: boolean;
  reload: Function;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      statusid: 1,
      assignee: '-1',
      body: '',
      deadline: {
        from: new Date(),
        to: new Date(),
      },
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
    };
    const res = await fetch(`/api/projects/${projectid}/issues`, {
      body: JSON.stringify(issue),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!res.ok) {
      console.log(res);
      toast({
        title: 'Issue not created',
        description: 'something went wrong',
      });
    } else {
      // const data = await res.json();
      reload();
      toast({
        title: 'Issue created',
        description: `Project successfully created`,
      });
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {button ? (
          <Button variant='outline' className='m-0 h-6 p-2 text-xs'>
            New Issue
          </Button>
        ) : (
          <button>
            <PlusIcon className='h-4 w-4' />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-3xl'>
        <DialogHeader>
          <DialogTitle>New Issue</DialogTitle>
          <DialogDescription>Create a new Issue</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='next big thing' {...field} />
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
                      placeholder='Type your message here.'
                      id='message-2'
                      className='h-60'
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex flex-row space-x-4'>
              <FormField
                control={form.control}
                name='statusid'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <StatusField {...field} />
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
                    <FormLabel>Assignee</FormLabel>
                    <FormControl>
                      <AssigneeField field={field} projectid={projectid} />
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
                    <FormLabel>Deadline</FormLabel>
                    <FormControl>
                      <DeadlineField field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type='submit'>Create</Button>
          </form>
        </Form>

        <DialogFooter className='sm:justify-start'>
          <DialogClose asChild></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
