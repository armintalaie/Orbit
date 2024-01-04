'use client';

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
import { toast } from 'sonner';
import { useContext, useState } from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '../ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DeadlineField } from '../issues/form/deadlineField';
import { StatusField } from '../issues/form/statusField';
import { Textarea } from '@/components/ui/textarea';
import { TeamField } from './form/teamField';
import { OrbitContext } from '@/lib/context/OrbitContext';

export const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  statusid: z.number(),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  statusid: z.number(),
  deadline: z.date().optional(),
  teamid: z.number(),
});

export function NewProject({
  defaultValues,
  button,
}: {
  button?: boolean;
  defaultValues?: Partial<z.infer<typeof formSchema>>;
}) {
  const [open, setOpen] = useState(false);
  const { fetcher, reload } = useContext(OrbitContext);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      statusid: 1,
      description: '',
      ...defaultValues,
    },
  });
  async function onSubmit() {
    const formVals = form.getValues();
    const project = {
      title: formVals.title,
      description: formVals.description,
      statusid: formVals.statusid,
      deadline: formVals.deadline
        ? formVals.deadline.toISOString().split('T')[0]
        : null,
      teamid: Number(formVals.teamid),
    };

    const res = await fetcher('/api/projects', {
      body: JSON.stringify(project),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!res.ok) {
      toast('Project not created', {
        description: 'something went wrong',
      });
    } else {
      reload(['projects']);
      toast('Project created', {
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
            New Project
          </Button>
        ) : (
          <button>
            <PlusIcon className='h-4 w-4' />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className='w-md overflow-hidden'>
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>Create a new project</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-full space-y-8 overflow-hidden px-2 '
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem className='w-full'>
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
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='What is the end goal?'
                      id='message-2'
                      className='h-30 w-full resize-none'
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex flex-row items-center space-x-4'>
              <FormField
                control={form.control}
                name='teamid'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TeamField field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </div>

            <Button type='submit' className='w-full'>
              Create
            </Button>
          </form>
        </Form>

        <DialogFooter className='sm:justify-start'>
          <DialogClose asChild></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
