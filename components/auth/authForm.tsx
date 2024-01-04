'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function AuthForm() {
  console.log(NEXT_PUBLIC_BASE_URL);
  const supabase = createClientComponentClient<any>();

  return (
    <Auth
      supabaseClient={supabase}
      view='sign_in'
      appearance={{ theme: ThemeSupa }}
      theme='light'
      onlyThirdPartyProviders={true}
      showLinks={true}
      providers={['google']}
      redirectTo={`${NEXT_PUBLIC_BASE_URL}/api/auth/callback`}
    />
  );
}
