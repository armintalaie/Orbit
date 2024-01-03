import { Session } from '@supabase/supabase-js';
import React, { useEffect, useState, Suspense } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const LoadingFallback = () => <div className='loading-fallback'></div>;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const UserSessionContext = React.createContext<Session | null>(null);

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  let supabase = createClientComponentClient<any>({ supabaseUrl, supabaseKey });

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: session2 } }) => {
      setSession(session2);
      // console.log(session2);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <div></div>;
  }
  return (
    <Suspense fallback={<LoadingFallback />}>
      <UserSessionContext.Provider value={session}>
        {children}
      </UserSessionContext.Provider>
    </Suspense>
  );
}
