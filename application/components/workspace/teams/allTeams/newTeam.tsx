'use client';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import React, { useContext, useMemo } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { gql, useMutation } from '@apollo/client';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import useQueryStatus from '@/lib/hooks/common/useQueryStatus';

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'names must be at least 3 characters long' })
    .max(60, { message: 'names must be less than 60 characters long' }),
  identifier: z
    .string()
    .min(3, { message: 'identifiers must be at least 3 characters long' })
    .max(5, { message: 'identifiers must be less than 5 characters long' }),
});

const NEW_TEAM = gql`
  mutation CreateTeam($workspaceId: String!, $team: NewTeamInput!) {
    createTeam(workspaceId: $workspaceId, team: $team) {
      id
      name
    }
  }
`;

export default function NewTeamModal({ children }: { children?: React.ReactNode }) {
  const { currentWorkspace } = useContext(OrbitContext);
  const [createTeam, { loading, data, error }] = useMutation(NEW_TEAM);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const status = useQueryStatus({ error, data, loading });
  const trigger = useMemo(() => {
    if (children) {
      return children;
    } else {
      return <Button size={'xs'}>New Team</Button>;
    }
  }, [children]);

  async function submit(data: any) {
    await createTeam({
      variables: {
        team: {
          ...data,
        },
        workspaceId: currentWorkspace,
      },
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>Create New Team</DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className='flex flex-col gap-1 pt-5 '>
            <FormField
              name={'name'}
              render={({ field }) => (
                <FormItem className='flex w-full flex-col gap-2 '>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='team name' {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name={'identifier'}
              render={({ field }) => (
                <FormItem className='flex w-full flex-col gap-2 '>
                  <FormLabel>Identifier</FormLabel>
                  <FormControl>
                    <Input placeholder='team identifier' {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button status={status} type='submit'>
              Create Team
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
