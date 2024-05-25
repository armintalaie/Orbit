'use client';
import React, { useState, Suspense, useContext, useEffect } from 'react';
import { UserSessionContext } from './AuthProvider';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/general/Spinner';
import { useQuery, gql } from '@apollo/client';

const LoadingFallback = () => <div className='loading-fallback'></div>;

type OrbitType = {
  currentWorkspace: any | null;
  changeWorkspace: (workspace: any) => void;
  fetcher: (input: string | URL | Request) => Promise<any>;
  swrFetcher: (url: string) => Promise<any>;
  user: any;
};

type OrbitContextType = {} & OrbitType;

export const OrbitContext = React.createContext<OrbitContextType>({
  currentWorkspace: null,
  changeWorkspace: async () => {},
  fetcher: async () => {},
  swrFetcher: async () => {},
  user: {},
});

export default function OrbitContextProvider({ children }: { children: React.ReactNode }) {
  const { session } = useContext(UserSessionContext);
  const router = useRouter();
  const { user, loading: userLoading, error: userError } = getUserInfo();
  const [orbit, setOrbit] = useState<OrbitType>({
    currentWorkspace: null,
    changeWorkspace: async () => {},
    fetcher: async () => {},
    swrFetcher: async () => {},
    user: {},
  });

  function changeWorkspace(id?: any) {
    setOrbit({
      ...orbit,
      currentWorkspace: id,
    });
  }

  useEffect(() => {
    const stored = window.localStorage.getItem('currentWorkspace');
    if (stored) {
      setOrbit({
        ...orbit,
        currentWorkspace: JSON.parse(stored),
      });
    }
  }, []);

  useEffect(() => {
    const currentWorkspace = orbit.currentWorkspace;

    if (currentWorkspace) {
      window.localStorage.setItem('currentWorkspace', JSON.stringify(currentWorkspace));
      router.push(`/orbit/workspace/${currentWorkspace}`);
    } else {
      window.localStorage.removeItem('currentWorkspace');
      router.push('/orbit/');
    }
  }, [orbit]);

  async function fetcher(input: string | URL | Request, init?: any | undefined): Promise<Response> {
    const res = fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: session.access_token,
      },
    });
    return res;
  }

  const swrFetcher = (url: string) => fetcher(url).then((res) => res.json());

  if (userLoading) {
    return <Spinner />;
  }

  if (userError) {
    return <div>Error! {userError.message}</div>;
  }

  const contextValue = {
    currentWorkspace: orbit.currentWorkspace,
    changeWorkspace,
    fetcher,
    swrFetcher,
    user: user.me,
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrbitContext.Provider value={contextValue}>
        <div className={`relative flex h-full w-full flex-col`}>{children}</div>
      </OrbitContext.Provider>
    </Suspense>
  );
}

const userQuery = gql`
  query {
    me {
      id
      email
      workspaces {
        id
        name
        status
      }
    }
  }
`;

function getUserInfo(): { user: { me: any }; loading: boolean; error: any } {
  const { data, loading, error } = useQuery(userQuery);
  return {
    user: data,
    loading,
    error,
  };
}
