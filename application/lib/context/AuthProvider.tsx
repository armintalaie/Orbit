'use client';
import { Session } from '@supabase/supabase-js';
import React, { useEffect, useState, Suspense } from 'react';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';

const LoadingFallback = () => <div className='loading-fallback'></div>;

export const UserSessionContext = React.createContext<Session>({} as Session);

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  let supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data && data.session) {
        setSession(data.session);
      } else {
        setSession(null);
        router.push('/auth/signin');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!session || !session.user || session === null) {
    return <></>;
  }
  return (
    <Suspense fallback={<LoadingFallback />}>
      <UserSessionContext.Provider value={session}>
        {children}
      </UserSessionContext.Provider>
    </Suspense>
  );
}
