'use client'; // top to the file

import { PlusIcon, RocketIcon } from 'lucide-react';
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
import { toast } from 'sonner';
import { useContext, useState } from 'react';
import { Form } from './ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserFinder } from './userFinder';
import { OrbitContext } from '@/lib/context/OrbitContext';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { useReward } from 'react-rewards';

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
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      statusid: 1,
      assignee: '-1',
      contents: '',
      deadline: {
        from: new Date(),
        to: new Date(),
      },
    },
  });
  const { fetcher } = useContext(OrbitContext);
  const [userInput, setUserInput] = useState(undefined);
  const { reward: confettiReward, isAnimating: isConfettiAnimating } =
    useReward('confettiReward', 'confetti', {
      zIndex: 1000,
      elementCount: 100,
      spread: 150,
      angle: 90,
      decay: 0.91,
      startVelocity: 40,
      lifetime: 300,
    });

  async function onSubmit() {
    const res = await fetcher(`/api/teams/${teamid}/members/${userInput}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!res.ok) {
      toast('Member not added', {
        description: 'something went wrong',
      });
    } else {
      if (!isConfettiAnimating) {
        confettiReward();
      }
      reload();
      setOpen(false);
      setUserInput(undefined);
      toast('Member added', {
        description: ``,
        action: {
          label: 'Add another',
          onClick: () => {
            setOpen(true);
          },
        },
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {button ? (
          <Button variant='outline' className='m-0 h-6 p-2 text-xs font-normal'>
            Add Member
          </Button>
        ) : (
          <button>
            <PlusIcon className='h-4 w-4' />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <Alert>
              <RocketIcon className='h-4 w-4' />
              <AlertTitle>Who you can add</AlertTitle>
              <AlertDescription>
                You can add anyone who has signed in at least once in the past.
              </AlertDescription>
            </Alert>
            <UserFinder val={userInput} setVal={setUserInput} teamid={teamid} />

            <Button
              type='submit'
              className='w-full text-sm'
              disabled={userInput === undefined}
            >
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
