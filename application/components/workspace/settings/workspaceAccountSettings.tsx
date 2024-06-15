'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../../ui/button';
import Image from 'next/image';
import { useContext } from 'react';
import { UserSessionContext } from '@/lib/context/AuthProvider';
import { Input } from '../../ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { toast } from 'sonner';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';

const schema = z.object({
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  pronouns: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  displayName: z.string().nullable().optional(),
  timezone: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
});

export default function WorkspaceAccountSettings() {
  const userSession = useContext(UserSessionContext);
  const { currentWorkspace } = useContext(OrbitContext);
  const user = userSession.session.user;
  const profile: {
    [key: string]: string;
  } = currentWorkspace.member;
  const { avatar, memberId, addedAt, updatedAt, workspaceId, userId, ...rest } = profile || {};

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: rest,
  });

  async function updateProfile(values: z.infer<typeof schema>) {
    const res = await fetch(`/api/v2/workspaces/${currentWorkspace.id}/members/${memberId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userSession.access_token}`,
      },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      toast('Workspace profile updated successfully');
    } else {
      toast('Profile update failed');
    }
  }

  return (
    <div className='flex w-full flex-col items-center  gap-5 '>
      <section className='flex w-full flex-col gap-4  '>
        <div className='flex flex-col items-center gap-10'>
          <div className='secondary-surface flex w-full flex-col gap-4 rounded border p-4 text-sm'>
            <p>This is your workspace profile. You can edit your profile details here.</p>
            <p>Your profile details are visible to all members of this workspace.</p>
          </div>
          <div className='flex items-center gap-2'>
            <Image
              src={avatar}
              alt='avatar'
              width={150}
              height={150}
              className='primary-surface rounded-full border-2 p-2 shadow-sm'
            />
          </div>

          <Form {...form}>
            <form className='flex w-full flex-col gap-2 px-4' onSubmit={form.handleSubmit(updateProfile)}>
              <div className='flex flex-1 items-center gap-2'>
                <label htmlFor='name' className='w-32 text-sm  font-semibold'>
                  Email
                </label>
                <Input id='name' name='name' value={user.email} disabled={true} />
              </div>

              {profile &&
                Object.entries(rest).map(([key, value]) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={key}
                    render={({ field }) => (
                      <FormItem className='flex items-center gap-2'>
                        <FormLabel className='w-32 text-sm  font-semibold'>{key.toLocaleUpperCase()}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              <div className='flex flex-1 items-center justify-end gap-2'>
                <Button type='submit'>Update</Button>
              </div>
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
}
