'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { usePathname } from 'next/navigation';

export default function AuthForm() {
  const pathname = usePathname();
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
      redirectTo={`${pathname}/api/auth/callback`}
    />
  );
}
