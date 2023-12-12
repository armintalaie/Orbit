// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
// import { cookies } from 'next/headers'
// import AccountForm from './account-form'
// // import { Database } from '../database.types'
// export default async function Account() {
//   const supabase = createServerComponentClient<any>({ cookies })
'use client';
import { ProfileForm } from '@/components/settings/profile-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

//   const {
//     data: { session },
//   } = await supabase.auth.getSession()

//   // return <AccountForm session={session} />

//   return (
//     <h1>Account</h1>
//   )
// }

// import { Separator } from "@/components/ui/separator"

export default function SettingsProfilePage() {
  async function signout() {
    const res = await fetch('/api/auth/signout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    if (res.redirected) {
      window.location.href = res.url;
    } else {
      console.log('signout');
    }
  }
  return (
    <div className='space-y-6'>
      <div></div>
      <Button
        variant='outline'
        onClick={() => signout()}
        className='w-32 rounded-md px-4 py-2 text-left text-sm font-medium text-gray-900 transition hover:bg-gray-100 focus:bg-gray-100 focus:outline-none'
      >
        Sign out
      </Button>

      {/* <ProfileForm /> */}
    </div>
  );
}
