'use client';
import { useEffect, useState, Suspense, ReactNode, createContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/general/Spinner';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

type UserSession = {
  session: Session;
};

export const UserSessionContext = createContext<UserSession>({} as UserSession);

export default function AuthContextProvider({ children }: { children: ReactNode }) {
  let supabase = createClient();
  const [sessionInfo, setSessionInfo] = useState<UserSession | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data && data.session) {
        setSessionInfo({ session: data.session });
      } else {
        router.push('/auth/signin');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSessionInfo({ session });
      } else {
        router.push('/auth/signin');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!sessionInfo || !sessionInfo.session || !sessionInfo.session.user || sessionInfo === null) {
    return <Spinner />;
  }

  const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    cache: new InMemoryCache({
      addTypename: false,
    }),
    headers: {
      authorization: `${sessionInfo.session.access_token}`,
    },
  });

  return (
    <Suspense fallback={<Spinner />}>
      <UserSessionContext.Provider value={sessionInfo}>
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </UserSessionContext.Provider>
    </Suspense>
  );
}
