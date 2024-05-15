'use client';
import React, { useState, Suspense, useContext, useEffect } from 'react';
import { UserSessionContext } from './AuthProvider';
const LoadingFallback = () => <div className='loading-fallback'></div>;

type OrbitType = {
  currentWorkspace: any | null;
  changeWorkspace: (workspace: any) => void;
  fetcher: (input: string | URL | Request) => Promise<any>;
};

type OrbitContextType = {} & OrbitType;

export const OrbitContext = React.createContext<OrbitContextType>({
  currentWorkspace: {},
  changeWorkspace: async () => {},
  fetcher: async () => {},
});

export default function OrbitContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useContext(UserSessionContext);
  const [loading, setLoading] = useState(true);
  const [orbit, setOrbit] = useState<OrbitType>({
    currentWorkspace: null,
    changeWorkspace: async () => {},
    fetcher: async () => {},
  });

  function changeWorkspace(id?: any) {
    setLoading(true);
    if (!id) {
      setOrbit({ ...orbit, currentWorkspace: null });
      return;
    }
    getWorkspace(id).then((data) => {
      setOrbit({ ...orbit, currentWorkspace: data });
      setLoading(false);
    });
  }

  async function fetcher(
    input: string | URL | Request,
    init?: any | undefined
  ): Promise<Response> {
    const res = fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: user?.access_token,
      },
    });

    return res;
  }

  async function getWorkspace(id: any) {
    // setLoading(false);

    const res = await fetch(`/api/v2/workspaces/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.access_token}`,
      },
    });
    let data = {};
    if (res.ok) {
      const result = await res.json();
      data = { ...result };
    } else {
      return null;
    }

    const memberRes = await fetch(
      `/api/v2/workspaces/${id}/members/${user.user.id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      }
    );
    let member = null;
    if (memberRes.ok) {
      member = await memberRes.json();
    }

    return { ...data, member: member };
  }

  const contextValue = {
    currentWorkspace: orbit.currentWorkspace,
    changeWorkspace,
    fetcher,
  };

  useEffect(() => {
    changeWorkspace();
  }, []);

  if (!user) {
    return <div></div>;
  }
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrbitContext.Provider value={contextValue}>
        <div className={`relative flex h-full w-full flex-col`}>
          {/* <div
            className='  z-100 absolute left-0 top-0 h-screen w-full'
            style={{
              display: loading ? 'block' : 'none',
              zIndex: 50,
              pointerEvents: loading ? 'none' : 'none',
              backgroundColor: 'black',
              opacity: 0.5,
            }}
          ></div> */}
          {children}
        </div>
      </OrbitContext.Provider>
    </Suspense>
  );
}
