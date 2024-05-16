'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '../ui/button';

import { useContext, useMemo, useState } from 'react';
import { Grid2X2, InfoIcon, LockIcon, PaintBucket, SettingsIcon, User2, Users2Icon } from 'lucide-react';
import ThemeToggle from '../themeToggle';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import WorkspaceGeneralSettings from '../workspace/settings/workspaceGeneralSettings';
import AccountWorkspaces from './accountWorkspaces';
import WorkspaceSecuritySettings from '../workspace/settings/workspaceSecuritySettings';
import UserAccountSettings from './userAccountSettings';
import WorkspaceAccountSettings from '../workspace/settings/workspaceAccountSettings';
import WorkspaceMembers from '../workspace/settings/workspaceMembersSettings';

export default function AccountModal() {
  const [activeMenu, setActiveMenu] = useState(['account', 'account']);
  const { currentWorkspace } = useContext(OrbitContext);
  const menuOptions = useMemo(
    () => ({
      account: {
        info: {
          label: 'Account',
          icon: <SettingsIcon size={16} />,
        },
        options: {
          account: {
            label: 'User Account',
            icon: <User2 size={16} />,
            content: <UserAccountSettings />,
          },
          appearance: {
            label: 'Appearance',
            icon: <PaintBucket size={16} />,
            content: <AppearanceSettings />,
          },
          workspaces: {
            label: 'Workspaces',
            icon: <Grid2X2 size={16} />,
            content: <AccountWorkspaces />,
          },
        },
      },
      ...(currentWorkspace && {
        workspace: {
          info: {
            label: currentWorkspace.name,
            icon: <Grid2X2 size={16} />,
          },

          options: {
            general: {
              label: 'General',
              icon: <InfoIcon size={16} />,
              content: <WorkspaceGeneralSettings />,
            },
            profile: {
              label: 'Profile',
              icon: <User2 size={16} />,
              content: <WorkspaceAccountSettings />,
            },
            members: {
              label: 'Members',
              icon: <Users2Icon size={16} />,
              content: <WorkspaceMembers />,
            },
            security: {
              label: 'Security and Roles',
              icon: <LockIcon size={16} />,
              content: <WorkspaceSecuritySettings />,
            },
          },
        },
      }),
    }),
    [currentWorkspace]
  );

  return (
    <Dialog>
      <DialogTrigger>
        <button>Settings</button>
      </DialogTrigger>
      <DialogContent className='flex h-full max-h-[90%] w-full max-w-6xl overflow-hidden p-0'>
        <ModalSidebar menuOptions={menuOptions} setActiveMenu={setActiveMenu} activeMenu={activeMenu} />
        <div className='flex flex-1 flex-col gap-4 divide-y overflow-hidden px-6 py-4 '>
          <h1 className='  overflow-scroll text-2xl  font-semibold '>
            {menuOptions[activeMenu[0]].options[activeMenu[1]].label}
          </h1>
          <section className='flex  w-full flex-col gap-4 overflow-scroll py-5 '>
            {menuOptions[activeMenu[0]].options[activeMenu[1]].content}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ModalSidebar({ menuOptions, setActiveMenu, activeMenu }) {
  return (
    <div className='secondary-surface flex w-56 min-w-56 flex-col'>
      <div className='flex flex-1 flex-col gap-2 p-4'>
        <div className='flex items-center gap-2'>
          <h1 className='text-lg font-bold'>Settings</h1>
        </div>

        {Object.entries(menuOptions).map(([menuKey, menu]) => (
          <div className='flex flex-col gap-2 py-5'>
            <div className='flex items-center gap-2 border-b pb-4 text-sm'>
              {menu.info.icon}
              {menu.info.label}
            </div>
            {Object.entries(menu.options).map(
              (
                [key, option] // Assuming items have an 'options' property to iterate over
              ) => (
                <Button
                  variant='ghost'
                  className='secondary-surface hover:tertiary-surface flex w-full justify-start gap-4 px-1'
                  key={option.id}
                  onClick={() => setActiveMenu([menuKey, key])}
                >
                  {option.icon}
                  {option.label}
                </Button>
              )
            )}
          </div>
        ))}

        <div className='flex  gap-2 '></div>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  return (
    <div className='flex h-full w-full flex-col  items-center gap-5'>
      <div className='secondary-surface flex h-full w-full flex-col  gap-5 rounded-md p-5'>
        At the moment, you can only change the theme of the application between light and dark.
        <ThemeToggle />
      </div>

      <div className='secondary-surface flex h-full w-full flex-col  items-center rounded-md p-5'>
        Your workspace admin can change the theme of the workspace to a custom theme.
      </div>
    </div>
  );
}
