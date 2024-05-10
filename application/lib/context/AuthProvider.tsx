'use client';
import { Session } from '@supabase/supabase-js';
import React, { useEffect, useState, Suspense } from 'react';
import { createClient } from '../utils/supabase/client';

const LoadingFallback = () => <div className='loading-fallback'></div>;

export const UserSessionContext = React.createContext<Session>({} as Session);

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  let supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log(data);
      if (data && data.session) setSession(data.session);
      console.log(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!session || !session.user || session === null) {
    return LoadingFallback;
  }
  return (
    <Suspense fallback={<LoadingFallback />}>
      <UserSessionContext.Provider value={session}>
        {children}
      </UserSessionContext.Provider>
    </Suspense>
  );
}
