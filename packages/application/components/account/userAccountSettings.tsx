'use client';

import { Button } from '../ui/button';
import { useContext } from 'react';
import { UserSessionContext } from '@/lib/context/AuthProvider';
import { createClient } from '@/lib/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';

export default function UserAccountSettings() {
  const { session } = useContext(UserSessionContext);
  const { user } = useContext(OrbitContext);
  const router = useRouter();

  async function deleteAccount() {
    const res = await fetch(`/api/v2/users/${user.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
    });
    const data = await res.json();
    if (res.ok) {
      toast(data.message);
      router.push('/auth/signup');
    } else {
      toast(data.error);
    }
  }

  async function signout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.localStorage.removeItem('currentWorkspace');
    router.push('/auth/signin');
  }

  return (
    <div className='flex w-full flex-col items-center  gap-5 '>
      <section className='flex w-full flex-col gap-4  '>
        <div className='flex items-center justify-between gap-4'>
          <h2 className='text-lg font-semibold'>Profile</h2>
          <Button onClick={signout} variant='outline' className='rounded-sm px-2 py-0 text-sm' type='button'>
            Sign out
          </Button>
        </div>

        <div className='flex flex-col items-center gap-10'>
          <div className='secondary-surface flex w-full flex-col gap-4 rounded border p-4 text-sm'>
            <p>
              For each workspace, you will have a separate profile that you can edit which would only be visible to the
              members of that workspace.
            </p>
          </div>

          <form className='flex w-full flex-col gap-2 px-4'>
            <div className='flex flex-1 items-center gap-2'>
              <label htmlFor='name' className='w-32 text-sm  font-semibold'>
                Email
              </label>
              <Input id='name' name='name' value={user.email} disabled={true} />
            </div>
          </form>
          <div className='flex w-full flex-1 flex-col items-start gap-2 border-t py-10'>
            <h3 className='text-lg font-semibold'>Danger Zone</h3>
            <div className='primary-surface flex w-full flex-col gap-5 rounded-md border p-5'>
              <p className='text-sm'>
                Deleting your account will permanently remove all you from all your workspaces and delete all your data.
                This action cannot be undone. You will have to create a new account to use Orbit again.
              </p>
              <Button type='submit' variant='destructive' className='w-fit' onClick={deleteAccount}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
