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
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { OrbitContext } from '@/lib/context/OrbitContext';
import { useReward } from 'react-rewards';

export const teamSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export function NewTeam({
  button,
  reload,
  teamid,
}: {
  button?: boolean;
  reload: Function;
  teamid?: string;
}) {
  const [open, setOpen] = useState(false);
  const { fetcher } = useContext(OrbitContext);
  const form = useForm<z.infer<typeof teamSchema>>({
    resolver: zodResolver(teamSchema),
  });
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
    const formVals = form.getValues();
    const team = {
      name: formVals.name,
      description: formVals.description,
    };
    const URL = '/api/teams/';
    const res = await fetcher(URL, {
      body: JSON.stringify(team),
      method: 'POST',
    });

    if (!res.ok) {
      toast('Team not created');
    } else {
      if (!isConfettiAnimating) {
        confettiReward();
      }
      reload(['teams']);
      toast('Team created');
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {button ? (
          <Button variant='outline' className='m-0 h-6 p-2 text-xs'>
            New Team
          </Button>
        ) : (
          <button>
            <PlusIcon className='h-4 w-4' />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-3xl'>
        <DialogHeader>
          <DialogTitle>New Team</DialogTitle>
          <DialogDescription className='pb-2'>
            Create a new team
          </DialogDescription>

          {/* <Alert>
            <InfoCircledIcon className='h-4 w-4' />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              By creating a new team, you will be a member of the team. You can
              add more members later on the team page.
            </AlertDescription>
          </Alert> */}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='What shall be the title of this legendary team'
                      {...field}
                    />
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
                      placeholder='Let the orbiters know what this team is about'
                      id='message-2'
                      className='h-10 resize-none'
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

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
