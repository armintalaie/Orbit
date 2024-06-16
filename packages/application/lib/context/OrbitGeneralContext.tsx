'use client';
import React, { useState, Suspense, useContext, useEffect, useMemo } from 'react';
import { UserSessionContext } from './AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import Spinner from '@/components/general/skeletons/Spinner';
import { useQuery, gql } from '@apollo/client';
import { IWorspace } from '../types';

const LoadingFallback = () => <div className='loading-fallback'></div>;

type OrbitType = {
  currentWorkspace: any | null;
  changeWorkspace: (workspace: any) => void;
  fetcher: (input: string | URL | Request) => Promise<any>;
  swrFetcher: (url: string) => Promise<any>;
  user: any;
  workspace: IWorspace;
};

type OrbitContextType = {} & OrbitType;

export const OrbitContext = React.createContext<OrbitContextType>({
  currentWorkspace: null,
  changeWorkspace: async () => {},
  fetcher: async () => {},
  swrFetcher: async () => {},
  user: {},
  workspace: {} as IWorspace,
});

export default function OrbitContextProvider({ children }: { children: React.ReactNode }) {
  const { session } = useContext(UserSessionContext);
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: userLoading, error: userError } = getUserInfo();
  const [checkedCache, setCheckedCache] = useState(false);

  const [orbit, setOrbit] = useState<OrbitType>({
    currentWorkspace: null,
    changeWorkspace: async () => {},
    fetcher: async () => {},
    swrFetcher: async () => {},
    user: {},
    workspace: {} as IWorspace,
  });
  const workspaceDetails = useMemo(() => {
    return getWorkspace();
  }, [user]);

  function changeWorkspace(id?: any) {
    setOrbit({
      ...orbit,
      currentWorkspace: id,
    });
  }

  function getWorkspace(id?: string) {
    const wid = id || orbit.currentWorkspace;
    try {
      return user.me.workspaces.find((workspace: any) => workspace.id === wid);
    } catch (error) {
      return null;
    }
  }

  useEffect(() => {
    const stored = window.localStorage.getItem('currentWorkspace');
    if (stored) {
      setOrbit({
        ...orbit,
        currentWorkspace: JSON.parse(stored),
      });
    }
    setCheckedCache(true);
  }, []);

  useEffect(() => {
    if (!checkedCache) return;
    const currentWorkspace = orbit.currentWorkspace;
    if (currentWorkspace) {
      window.localStorage.setItem('currentWorkspace', JSON.stringify(currentWorkspace));
      if (!pathname.startsWith(`/orbit/workspace/${currentWorkspace}`)) {
        router.push(`/orbit/workspace/${currentWorkspace}`);
      }
    } else {
      alert('No workspace selected');
      window.localStorage.removeItem('currentWorkspace');
      router.push('/orbit/');
    }
  }, [orbit.currentWorkspace, checkedCache]);

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
    workspace: workspaceDetails,
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
        members {
          id
          email
          profile {
            firstName
            lastName
            avatar
            username
          }
        }
        teams {
          id
          name
          identifier
        }
        projects {
          id
          name
        }
        config {
          issueStatus {
            id
            name
            description
          }
          projectStatus {
            id
            name
            description
          }
        }
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
