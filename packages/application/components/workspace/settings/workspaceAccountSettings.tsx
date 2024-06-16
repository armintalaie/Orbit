'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../../ui/button';
import Image from 'next/image';
import { useContext, useEffect } from 'react';
import { Input } from '../../ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { gql, useMutation, useQuery } from '@apollo/client';
import { toast } from 'sonner';

const schema = z.object({
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  pronouns: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  timezone: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
});

const UPDATE_PROFILE = gql`
  mutation updateWorkspaceMember($workspaceId: String!, $userId: String!, $profile: UpdateMemberInput!) {
    updateWorkspaceMember(profile: $profile, userId: $userId, workspaceId: $workspaceId) {
      profile {
        firstName
        lastName
        pronouns
        avatar
        location
      }
    }
  }
`;

export default function WorkspaceAccountSettings() {
  const { currentWorkspace } = useContext(OrbitContext);
  const { member, loading, error } = useWorkspaceMember();
  const [updateProfileRequest] = useMutation(UPDATE_PROFILE);
  const profile = member?.profile;
  const avatar = profile?.avatar;
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: profile,
  });

  async function updateProfile(values: z.infer<typeof schema>) {
    updateProfileRequest({
      variables: {
        workspaceId: currentWorkspace,
        userId: member.id,
        profile: {
          ...values,
        },
      },
    }).then((res) => {
      if (res.data?.updateWorkspaceMember?.profile) {
        toast('Profile updated');
        form.reset(res.data.updateWorkspaceMember?.profile);
      } else {
        toast('Failed to update profile');
      }
    });
  }

  useEffect(() => {
    form.reset(profile);
  }, [member]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading member</div>;

  return (
    <div className='flex w-full flex-col items-center  gap-5 '>
      <section className='flex w-full flex-col gap-4  '>
        <div className='flex flex-col items-center gap-10'>
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
                <Input id='name' name='name' value={member.email} disabled={true} />
              </div>

              {profile &&
                Object.entries(profile).map(([key, value]) => (
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
                <Button size={'sm'} type='submit'>
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

function useWorkspaceMember() {
  const memberQuery = gql`
    query ($id: String!) {
      workspace(id: $id) {
        member {
          id
          email
          profile {
            firstName
            lastName
            avatar
            username
            pronouns
            location
          }
        }
      }
    }
  `;
  const { currentWorkspace } = useContext(OrbitContext);
  const { data, error, loading } = useQuery(memberQuery, {
    variables: { id: currentWorkspace },
  });

  return {
    member: data?.workspace?.member,
    loading,
    error,
  };
}
