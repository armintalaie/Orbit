'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { toast } from 'sonner';
import { OrbitContext } from '@/lib/context/OrbitContext';
import { useContext } from 'react';
import { UserSessionContext } from '@/lib/context/AuthProvider';

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    })
    .optional(),
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email()
    .optional(),
  full_name: z.string().optional(),
  website: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const defaultValues: Partial<ProfileFormValues> = {};

export function ProfileForm() {
  const { fetcher, profile } = useContext(OrbitContext);
  const UserSession = useContext(UserSessionContext);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const signout = async () => {
    const res = await fetcher(`/api/auth/signout`, {
      method: 'POST',
    });
    if (res.ok) {
      window.location.href = '/';
    }
  };

  function onSubmit(data: ProfileFormValues) {
    toast('You submitted the following values:', {
      description: (
        <div className='flex w-fit items-center justify-center p-2'>
          <pre className=' w-full rounded-md bg-slate-950 p-4'>
            <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
          </pre>
        </div>
      ),
    });

    fetcher(`/api/profiles/${UserSession?.user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  if (!profile) {
    return <div className='flex items-center space-x-4'></div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl></FormControl>
                <Input {...field} placeholder={profile.email} />
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='full_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder={profile.full_name} {...field} />
              </FormControl>
              <FormDescription>This is your display name. please enter your full name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='website'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder={profile.website} {...field} />
              </FormControl>
              <FormDescription>optionally enter your website.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder={profile.username} {...field} />
              </FormControl>
              <FormDescription>
                This is your username. A @mentionable name that will be displayed on your profile.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div></div>
        <div className='flex items-center justify-end gap-2 p-1 text-sm'>
          <Button variant='outline' className='rounded-sm px-2 py-0 text-sm' type='submit'>
            Update profile
          </Button>
          <Button onClick={signout} variant='outline' className='rounded-sm px-2 py-0 text-sm' type='button'>
            Sign out
          </Button>
        </div>
      </form>
    </Form>
  );
}
