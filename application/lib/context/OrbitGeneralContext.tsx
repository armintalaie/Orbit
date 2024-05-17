'use client';
import React, { useState, Suspense, useContext, useEffect } from 'react';
import { UserSessionContext } from './AuthProvider';
import { useParams, usePathname, useRouter } from 'next/navigation';
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

export default function OrbitContextProvider({ children }: { children: React.ReactNode }) {
  const user = useContext(UserSessionContext);
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [orbit, setOrbit] = useState<OrbitType>({
    currentWorkspace: null,
    changeWorkspace: async () => {},
    fetcher: async () => {},
  });

  function changeWorkspace(id?: any) {
    setLoading(true);
    if (!id) {
      setOrbit({
        ...orbit,
        currentWorkspace: null,
      });
      return;
    }
    getWorkspace(id).then((data) => {
      window.localStorage.setItem('currentWorkspace', JSON.stringify(data));
      if (!pathname.includes(`/workspace/${id}`)) {
        router.replace(`/orbit/workspace/${id}`);
      }
      setOrbit({
        ...orbit,
        currentWorkspace: data,
      });
      setLoading(false);
    });
  }

  async function fetcher(input: string | URL | Request, init?: any | undefined): Promise<Response> {
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
    const res = await fetch(`/api/v2/workspaces/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.access_token}`,
      },
    });
    let data = {};
    if (res.ok) {
      const result = await res.json();
      data = {
        ...result,
      };
    } else {
      return null;
    }

    const memberRes = await fetch(`/api/v2/workspaces/${id}/members/${user.user.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.access_token}`,
      },
    });
    let member = null;
    if (memberRes.ok) {
      member = await memberRes.json();
    }

    return {
      ...data,
      member: member,
    };
  }

  const contextValue = {
    currentWorkspace: orbit.currentWorkspace,
    changeWorkspace,
    fetcher,
  };

  useEffect(() => {
    // if (window.localStorage.getItem('currentWorkspace')) {
    //   const workspace = JSON.parse(window.localStorage.getItem('currentWorkspace') || '{}');
    //   if (workspace && workspace.id) {
    //     setOrbit({
    //       ...orbit,
    //       currentWorkspace: workspace,
    //     });

    //     changeWorkspace(workspace.id);
    //   } else {
    //     console.log(user);
        
    //   }
    // }
    if (user) {
      getUserInfo().then((data) => {
        if (data && data.workspaces.length > 0) {
          changeWorkspace(data.workspaces[0].workspaceId);
        }
      });
    }
  }, []);

  async function getUserInfo() {
    const res = await fetch(`/api/v2/users/${user.user.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.access_token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  }

  if (!user || contextValue.currentWorkspace === null) {
    return <div></div>;
  }
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrbitContext.Provider value={contextValue}>
        <div className={`relative flex h-full w-full flex-col`}>{children}</div>
      </OrbitContext.Provider>
    </Suspense>
  );
}
