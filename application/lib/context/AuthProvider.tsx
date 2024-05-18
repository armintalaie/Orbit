'use client';
import { useEffect, useState, Suspense, ReactNode, createContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/general/Spinner';

type UserSession = {
  account: any;
} & Session;

export const UserSessionContext = createContext<UserSession>({} as UserSession);

export default function AuthContextProvider({ children }: { children: ReactNode }) {
  let supabase = createClient();
  const [sessionInfo, setSessionInfo] = useState<UserSession | null>(null);
  const router = useRouter();

  async function getUserInfo({ userid, token }: { userid: string; token: string }) {
    const res = await fetch(`/api/v2/users/${userid}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    let data = null;
    if (res.ok) {
      data = await res.json();
    }
    return data;
  }

  async function addUserInfo({ userid, token, authdata }: { userid: string; token: string; authdata: any }) {
    const data = await getUserInfo({ userid: userid, token: token });
    if (!data) {
      router.push('/auth/signin');
    }
    setSessionInfo({
      ...authdata,
      account: data,
      user: data,
    });
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data && data.session) {
        addUserInfo({ userid: data.session.user.id, token: data.session.access_token, authdata: data });
      } else {
        setSessionInfo(null);
        router.push('/auth/signin');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionInfo(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!sessionInfo || !sessionInfo.session || !sessionInfo.session.user || sessionInfo === null) {
    return (
      <>
        <Spinner />
      </>
    );
  }
  return (
    <Suspense fallback={<Spinner />}>
      <UserSessionContext.Provider value={sessionInfo}>{children}</UserSessionContext.Provider>
    </Suspense>
  );
}
