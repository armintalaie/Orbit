'use client';

import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { gql, useMutation } from '@apollo/client';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { useContext } from 'react';

const ADD_MEMBER_MUTATION = gql`
  mutation newWorkspaceMember($member: NewMemberInput!, $workspaceId: String!) {
    newWorkspaceMember(member: $member, workspaceId: $workspaceId) {
      id
      email
    }
  }
`;

export function WorkspaceInvites({ members }) {
  const { currentWorkspace } = useContext(OrbitContext);

  const schema = z.object({
    email: z
      .string()
      .email()
      .refine((arg) => members.findIndex((m) => m.email === arg) === -1, {
        message: 'User is already a member of the workspace',
      }),
  });
  const [addMember, { data, loading, error }] = useMutation(ADD_MEMBER_MUTATION);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  async function inviteUser(data: z.infer<typeof schema>) {
    console.log(data);
    try {
      addMember({
        variables: {
          member: {
            email: data.email,
          },
          workspaceId: currentWorkspace,
        },
      })
        .then((res) => {
          if (res.data) {
            toast('User invited');
          } else {
            toast('Failed to invite user');
          }
        })
        .catch((e) => {
          console.log('mim');
          console.error(e);
          toast('Failed to invite user');
        });
    } catch (e) {
      console.error(e);
      toast('Failed to invite user');
    }
  }

  return (
    <div className=' flex w-full flex-col gap-2  '>
      <div className=' flex  w-full flex-col gap-2   rounded-md  p-5 text-sm '>
        <Form {...form}>
          <form className=' flex w-full flex-col items-end gap-2 rounded-md ' onSubmit={form.handleSubmit(inviteUser)}>
            <FormField
              control={form.control}
              name={'email'}
              render={({ field }) => (
                <FormItem className='flex h-32 w-full flex-col gap-2'>
                  <FormLabel className=' flex-shrink-0 text-sm  font-semibold'>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='john@orbit.com' {...field} className='mt-0' />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <p className='text-xs'>Invited users must have an account on Orbit to accept the invite.</p>

            <Button type='submit' variant={'default'}>
              Add Member
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default function WorkspaceMemberInviteModal({ members }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'xs'} variant={'default'}>
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className={'flex max-w-2xl flex-col justify-start  gap-10 p-4 '}>
        <DialogHeader>
          <h2 className='text-lg font-semibold'>Invite Member</h2>
        </DialogHeader>
        <WorkspaceInvites members={members} />
      </DialogContent>
    </Dialog>
  );
}
