'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

export default function AuthForm() {
  const [path, setPath] = useState('');
  useEffect(() => {
    setPath(window.location.origin);
  }, []);
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
      redirectTo={`${path}/api/auth/callback`}
    />
  );
}
