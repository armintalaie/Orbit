'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useContext, useMemo, useState } from 'react';
import { Grid2X2, InfoIcon, SettingsIcon, User2, Users2Icon } from 'lucide-react';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import WorkspaceGeneralSettings from '@/components/workspace/settings/workspaceGeneralSettings';
import WorkspaceAccountSettings from '@/components/workspace/settings/workspaceAccountSettings';
import WorkspaceMembers from '@/components/workspace/settings/workspaceMembersSettings';
import { Button } from '@/components/ui/button';
import ModalSidebar from '@/components/account/accountModalSidebar';

export default function TeamSettingsModal() {
  const [activeMenu, setActiveMenu] = useState(['workspace', 'general']);
  const { currentWorkspace } = useContext(OrbitContext);
  const menuOptions = useMemo(
    () => ({
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
            // security: {
            //   label: 'Security and Roles',
            //   icon: <LockIcon size={16} />,
            //   content: <WorkspaceSecuritySettings />,
            // },
          },
        },
      }),
    }),
    [currentWorkspace]
  );

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant='ghost' className='flex items-center gap-2'>
          <SettingsIcon size={16} />
          Team Settings
        </Button>
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
