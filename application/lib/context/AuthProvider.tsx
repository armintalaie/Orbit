'use client';
import { Session } from '@supabase/supabase-js';
import React, { useEffect, useState, Suspense } from 'react';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';
import { toCamelCase } from '../util';

const LoadingFallback = () => <div className='loading-fallback'></div>;

type UserSession = {
  account: any;
} & Session;

export const UserSessionContext = React.createContext<UserSession>(
  {} as UserSession
);

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  let supabase = createClient();
  const [session, setSession] = useState<UserSession | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data && data.session) {
        supabase
          .from('account')
          .select('*')
          .eq('id', data.session.user.id)
          .single()
          .then(({ data: accountdata }) => {
            if (!data) {
              router.push('/auth/signin');
            } else {
              console.log(data);
              console.log(data.session);
              const accountdataCamel = Object.keys(accountdata).reduce(
                (acc, key) => {
                  acc[toCamelCase(key)] = accountdata[key];
                  return acc;
                },
                {}
              );

              setSession({ ...data.session, account: accountdataCamel });
            }
          });
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
