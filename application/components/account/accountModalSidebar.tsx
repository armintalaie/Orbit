'use client';

import Link from 'next/link';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { useContext, useMemo } from 'react';
import { ArrowLeftIcon, Grid2X2, InfoIcon, PaintBucket, SettingsIcon, User2, Users2Icon } from 'lucide-react';

export default function ModalSidebar() {
  const { currentWorkspace } = useContext(OrbitContext);
  const menuOptions = useMemo(
    () => ({
      account: {
        info: {
          label: 'Orbit',
          icon: <SettingsIcon size={16} />,
        },
        options: {
          account: {
            label: 'Account',
            icon: <User2 size={16} />,
            route: '/account',
          },
          appearance: {
            label: 'Appearance',
            icon: <PaintBucket size={16} />,
            route: '/account/appearance',
          },
        },
      },
      ...(currentWorkspace && {
        workspace: {
          info: {
            label: 'Workspace',
            icon: <Grid2X2 size={16} />,
          },
          options: {
            general: {
              label: 'General',
              icon: <InfoIcon size={16} />,
              route: '/workspace/',
            },
            profile: {
              label: 'Profile',
              icon: <User2 size={16} />,
              route: '/workspace/profile',
            },
            members: {
              label: 'Members',
              icon: <Users2Icon size={16} />,
              route: '/workspace/members',
            },
          },
        },
      }),
    }),
    [currentWorkspace]
  );

  return (
    <div className='secondary-surface flex w-56 min-w-56 flex-col'>
      <div className='flex flex-1 flex-col gap-2 p-4'>
        <div className='flex items-center gap-2'>
          <Link href={`/orbit/workspace/${currentWorkspace}`}>
            <ArrowLeftIcon size={16} />
          </Link>
          <h1 className='text-lg font-bold'>Settings</h1>
        </div>

        {Object.entries(menuOptions).map(([menuKey, menu]) => (
          <div className='flex flex-col gap-2 py-5 '>
            <div className='flex items-center gap-2 border-b pb-4 text-sm text-neutral-600'>
              {menu.info.icon}
              {menu.info.label}
            </div>
            <div className={`flex flex-col`}>
              {Object.entries(menu.options).map(
                (
                  [key, option] // Assuming items have an 'options' property to iterate over
                ) => (
                  <Link
                    className='secondary-surface hover:tertiary-surface flex h-10 w-full items-center justify-start gap-4 rounded px-1 text-xs'
                    key={option.id}
                    href={`/orbit/workspace/${currentWorkspace}/settings/${option.route}`}
                  >
                    {option.icon}
                    {option.label}
                  </Link>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
