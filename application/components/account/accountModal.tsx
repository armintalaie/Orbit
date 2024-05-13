'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { useContext, useMemo, useState } from 'react';
import {
  Grid2X2,
  InfoIcon,
  LockIcon,
  PaintBucket,
  SettingsIcon,
  User2,
  Users2Icon,
} from 'lucide-react';
import { UserSessionContext } from '@/lib/context/AuthProvider';
import ThemeToggle from '../themeToggle';
import { createClient } from '@/lib/utils/supabase/client';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import WorkspaceGeneralSettings from '../workspace/workspaceGeneralSettings';
import AccountWorkspaces from './accountWorkspaces';
const fetcher = (url) => fetch(url).then((res) => res.json());

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
            content: <AccountSettings />,
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
              content: <WorkspaceMembers />,
            },
            members: {
              label: 'Members',
              icon: <Users2Icon size={16} />,
              content: <WorkspaceMembers />,
            },
            security: {
              label: 'Security and Roles',
              icon: <LockIcon size={16} />,
              content: <SecuritySettings />,
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
        <ModalSidebar
          menuOptions={menuOptions}
          setActiveMenu={setActiveMenu}
          activeMenu={activeMenu}
        />
        <div className='flex flex-1 flex-col gap-4 divide-y overflow-hidden px-6 py-4 '>
          <h1 className='  overflow-scroll text-2xl  font-semibold '>
            {menuOptions[activeMenu[0]].options[activeMenu[1]].label}
          </h1>
          <section className='flex  w-full flex-col gap-4 py-5  '>
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

export function AccountSettings() {
  const UserSession = useContext(UserSessionContext);
  const user = UserSession.user;
  const router = useRouter();

  async function signout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/signin');
  }

  return (
    <div className='flex w-full flex-col items-center  gap-5 '>
      <section className='flex w-full flex-col gap-4 py-5 '>
        <div className='flex items-center gap-4'>
          <h2 className='text-lg font-semibold'>Profile</h2>
          <Button
            onClick={signout}
            variant='outline'
            className='rounded-sm px-2 py-0 text-sm'
            type='button'
          >
            Sign out
          </Button>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <label htmlFor='name' className='text-sm font-semibold'>
              Email
            </label>
            <p>{user.email}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function AppearanceSettings() {
  return (
    <div className='flex h-full w-full flex-col  items-center gap-5'>
      <div className='secondary-surface flex h-full w-full flex-col  gap-5 rounded-md p-5'>
        At the moment, you can only change the theme of the application between
        light and dark.
        <ThemeToggle />
      </div>

      <div className='secondary-surface flex h-full w-full flex-col  items-center rounded-md p-5'>
        Your workspace admin can change the theme of the workspace to a custom
        theme.
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className='flex h-full w-full flex-col  items-center gap-5'>
      <div className='secondary-surface flex h-full w-full flex-col  items-center rounded-md p-5'>
        You can change your password here.
      </div>
      <div className='secondary-surface flex h-full w-full flex-col  items-center rounded-md p-5'>
        You can enable two-factor authentication here.
      </div>
    </div>
  );
}

function WorkspaceMembers() {
  const { currentWorkspace } = useContext(OrbitContext);
  const [showInvites, setShowInvites] = useState(false);

  const { data, error, isLoading } = useSWR(
    `/api/v2/workspaces/${currentWorkspace.id}/members`,
    fetcher
  );

  const membersComponent = useMemo(
    () => <MembersSection members={data} isLoading={isLoading} />,
    [data]
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading members</div>;

  return (
    <div className='flex h-full w-full flex-col items-center gap-5 overflow-hidden'>
      <div className=' flex w-full flex-col   gap-5'>
        <div className=' flex w-full  justify-between   gap-5'>
          <h2 className='w-full text-left text-lg font-semibold'>Members</h2>
          <Button onClick={() => setShowInvites((prev) => !prev)}>
            {showInvites ? 'Close Invites' : 'Invite Member'}
          </Button>
        </div>

        {showInvites ? <WorkspaceInvites /> : membersComponent}
      </div>
    </div>
  );
}

function MembersSection({ members, isLoading }) {
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className='secondary-surface flex w-full flex-col items-center   justify-start overflow-x-scroll rounded border text-sm'>
      <div className='primary-surface flex w-full flex-shrink-0 justify-between gap-4 border-b p-2 '>
        <span className='w-40 flex-shrink-0'>Name</span>
        <span className='w-40 flex-shrink-0'>Username</span>
        <span className='w-40 flex-shrink-0'>Added At</span>
        <span className='w-40 flex-shrink-0'>Roles</span>
      </div>
      {members?.map((member) => (
        <div className=' primary-surface flex w-full justify-between gap-4 p-2  '>
          <span className='w-40 flex-shrink-0'>{member.username}</span>
          <span className='w-40 flex-shrink-0'>{member.username}</span>
          <span className='w-40 flex-shrink-0'>
            {new Date(member.addedAt).toLocaleDateString()}
          </span>
          <span className='w-40 flex-shrink-0'>Default</span>
        </div>
      ))}
    </div>
  );
}

function WorkspaceInvites() {
  const roles = ['Admin', 'Member', 'Viewer'];
  return (
    <div className=' flex w-full flex-col gap-2  '>
      <div className='secondary-surface  flex w-full items-end  gap-5 rounded-md p-3 text-sm '>
        <p>Currently you can only invite one person at a time.</p>
      </div>
      <div className='primary-surface flex w-full items-end  gap-5 rounded-md border p-3 shadow-sm'>
        <div className=' flex w-full  gap-5 '>
          <div className='flex w-full flex-col gap-2'>
            <Label htmlFor='email'>Email</Label>
            <Input type='email' name='email' placeholder='john@email.com' />
          </div>
          <div className='flex w-full flex-col gap-2'>
            <Label htmlFor='role'>Role</Label>
            <Select>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Select a Role' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button>Invite</Button>
      </div>
    </div>
  );
}
