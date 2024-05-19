'use client';

import { Button } from '../../ui/button';
import { useContext } from 'react';
import useSWR from 'swr';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { Input } from '../../ui/input';
import { Role } from '@/lib/types';
import { UserSessionContext } from '@/lib/context/AuthProvider';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const schema = z.object({
  email: z.string().email(),
});

export default function WorkspaceInvites() {
  const { currentWorkspace } = useContext(OrbitContext);
  const user = useContext(UserSessionContext);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      roles: [],
    },
  });

  async function inviteUser(data: z.infer<typeof schema>) {
    const res = await fetch(`/api/v2/workspaces/${currentWorkspace.id}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.access_token}`,
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const result = await res.json();
      toast(result.message);
    } else {
      toast('Failed to invite user');
    }
  }

  return (
    <div className=' flex w-full flex-col gap-2  '>
      <div className='primary-surface flex  w-full flex-col gap-2   rounded-md border p-5 text-sm shadow-sm'>
        <Form {...form}>
          <form
            className='primary-surface flex w-full flex-col items-end gap-2 rounded-md '
            onSubmit={form.handleSubmit(inviteUser)}
          >
            <FormField
              control={form.control}
              name={'email'}
              render={({ field }) => (
                <FormItem className='flex w-full items-center gap-2'>
                  <FormLabel className=' flex-shrink-0 text-sm  font-semibold'>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='john@orbit.com' {...field} className='mt-0' />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' variant={'default'}>
              Invite
            </Button>
          </form>
        </Form>
        <p className='text-xs'>Invited users must have an account on Orbit to accept the invite.</p>
      </div>
    </div>
  );
}

function useWorkspaceRoles() {
  const { currentWorkspace } = useContext(OrbitContext);
  const { data, error, isLoading } = useSWR(`/api/v2/workspaces/${currentWorkspace.id}/roles`, fetcher);

  return {
    roles: data as Role[],
    isLoading,
    error,
  };
}
