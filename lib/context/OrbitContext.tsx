import React, { useEffect, useState, Suspense, useContext } from 'react';
import { ILabel, IProject, IStatus, ITeam } from '../types/issue';
import { UserSessionContext } from './AuthProvider';

const LoadingFallback = () => <div className='loading-fallback'></div>;

type OrbitType = {
  labels: ILabel[];
  status: IStatus[];
  projects: IProject[];
  teams: ITeam[];
};

type ReloadTypes = 'labels' | 'status' | 'projects' | 'teams';

type OrbitContextType = {
  fetcher: (
    input: string | URL | Request,
    init?: any | undefined
  ) => Promise<Response>;
  reload: (items?: ReloadTypes[]) => Promise<void>;
} & OrbitType;

export const OrbitContext = React.createContext<OrbitContextType>({
  labels: [],
  status: [],
  projects: [],
  teams: [],
  fetcher: async () => {
    return new Response();
  },
  reload: async () => {},
});

export default function OrbitContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useContext(UserSessionContext);
  const [orbit, setOrbit] = useState<OrbitType>({
    labels: [],
    status: [],
    projects: [],
    teams: [],
  });

  const reload = async (items: ReloadTypes[] = []) => {
    if (items.length === 0) {
      await setupOrbit();
    } else {
      const p = Promise.all(
        items.map((item) => {
          switch (item) {
            case 'labels':
              return getLabels();
            case 'status':
              return getStatus();
            case 'projects':
              return getProjects();
            case 'teams':
              return getTeams();
          }
        })
      );
      await p;
    }
  };

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

  const getLabels = async () => {
    const res = await fetcher('/api/issues/labels');
    const data = await res.json();
    setOrbit((prev) => ({ ...prev, labels: data as ILabel[] }));
  };

  const getStatus = async () => {
    const res = await fetcher('/api/issues/status');
    const data = await res.json();
    setOrbit((prev) => ({ ...prev, status: data }));
  };

  const getProjects = async () => {
    const res = await fetcher('/api/projects');
    const data = await res.json();
    setOrbit((prev) => ({ ...prev, projects: data }));
  };

  const getTeams = async () => {
    const res = await fetcher('/api/teams');
    const data = await res.json();
    setOrbit((prev) => ({ ...prev, teams: data }));
  };

  const setupOrbit = async () => {
    const p = Promise.all([
      getLabels(),
      getStatus(),
      getProjects(),
      getTeams(),
    ]);
    await p;
  };

  useEffect(() => {
    if (user) {
      setupOrbit();
    }
  }, []);

  const orbitContext = {
    ...orbit,
    fetcher,
    reload,
  };

  if (!user) {
    return <div></div>;
  }
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrbitContext.Provider value={orbitContext}>
        {children}
      </OrbitContext.Provider>
    </Suspense>
  );
}
