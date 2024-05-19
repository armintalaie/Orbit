'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/utils/supabase/server';
import { db } from '@/lib/db/handler';

export async function signin(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);
  console.log(error);

  if (error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'Success',
  };
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return {
      message: error.message,
    };
  }

  await createUserAccount(data);

  revalidatePath('/', 'layout');
  redirect('/orbit');
}

async function createUserAccount(data: { email: string }) {
  const userId = await db.selectFrom('auth.users').where('email', '=', data.email).select('id').executeTakeFirst();

  await db
    .insertInto('public.account')
    .values({
      id: userId.id,
      avatar: 'https://vzbnqbrfobqivmismxxj.supabase.co/storage/v1/object/public/profile_photos/default/av4.png',
    })
    .execute();
}

export async function signinAction(prevState: any, formData: FormData) {
  const res = await signin(formData);

  if (res.message) {
    return {
      ...prevState,
      message: res.message,
    };
  }

  revalidatePath('/', 'layout');
  redirect('/orbit');
}

export async function signupAction(prevState: any, formData: FormData) {
  const res = await signup(formData);

  if (res.message) {
    return {
      ...prevState,
      message: res.message,
    };
  }

  revalidatePath('/', 'layout');
  redirect('/auth/signin');
}
