'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '../ui/button';
import Image from 'next/image';

import { useContext } from 'react';
import { UserSessionContext } from '@/lib/context/AuthProvider';
import { createClient } from '@/lib/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { toast } from 'sonner';

const schema = z.object({
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  pronouns: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
});

export default function UserAccountSettings() {
  const userSession = useContext(UserSessionContext);
  const user = userSession.user;
  const router = useRouter();
  const profile: { [key: string]: string } = userSession.account;
  const { avatar, id, ...rest } = profile || {};

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: rest,
  });

  async function signout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/signin');
  }

  async function updateProfile(values: z.infer<typeof schema>) {
    const res = await fetch(`/api/v2/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userSession.access_token}`,
      },
      body: JSON.stringify({ profile: values }),
    });
    if (res.ok) {
      toast('Profile updated successfully');
    } else {
      toast('Profile update failed');
    }
  }

  return (
    <div className='flex w-full flex-col items-center  gap-5 '>
      <section className='flex w-full flex-col gap-4  '>
        <div className='flex items-center justify-between gap-4'>
          <h2 className='text-lg font-semibold'>Profile</h2>
          <Button
            onClick={signout}
            variant='outline'
            className='rounded-sm px-2 py-0 text-sm'
            type='button'
          >
            Sign out
          </Button>
        </div>

        <div className='flex flex-col items-center gap-10'>
          <div className='secondary-surface flex w-full flex-col gap-4 rounded border p-4 text-sm'>
            <p>
              This is your main account profile. You can edit your name, avatar,
              and other information.
            </p>
            <p>
              For each workspace, you will have a separate profile that you can
              edit which would only be visible to the members of that workspace.
            </p>
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
            <form
              className='flex w-full flex-col gap-2 px-4'
              onSubmit={form.handleSubmit(updateProfile)}
            >
              <div className='flex flex-1 items-center gap-2'>
                <label htmlFor='name' className='w-32 text-sm  font-semibold'>
                  Email
                </label>
                <Input
                  id='name'
                  name='name'
                  value={user.email}
                  disabled={true}
                />
              </div>

              {profile &&
                Object.entries(rest).map(([key, value]) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={key}
                    render={({ field }) => (
                      <FormItem className='flex items-center gap-2'>
                        <FormLabel className='w-32 text-sm  font-semibold'>
                          {key.toLocaleUpperCase()}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              <div className='flex flex-1 items-center justify-end gap-2'>
                <Button
                  //   disabled={form.getValues().toString() !== profile.toString()}
                  type='submit'
                >
                  Update
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
}
