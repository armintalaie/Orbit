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
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { Form } from './ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserFinder } from './userFinder';

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

export function NewTeamMember({
  teamid,
  button,
  reload,
}: {
  teamid: number;
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

  const [userInput, setUserInput] = useState(undefined);
  async function onSubmit() {
    const res = await fetch(`/api/teams/${teamid}/members/${userInput}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!res.ok) {
      console.log(res);
      toast({
        title: 'Member not added',
        description: 'something went wrong',
      });
    } else {
      reload();
      toast({
        title: 'Member added',
        description: ``,
      });
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {button ? (
          <Button variant='outline' className='m-0 h-6 p-2 text-xs'>
            Add Member
          </Button>
        ) : (
          <button>
            <PlusIcon className='h-4 w-4' />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>Add a new member</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <UserFinder val={userInput} setVal={setUserInput} teamid={teamid} />
            <Button type='submit' className='text-sm'>
              Add
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