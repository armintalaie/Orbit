'use client';
import { UserSessionContext } from '@/lib/context/AuthProvider';
import { useContext, useEffect, useState } from 'react';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function WorkspaceSecuritySettings() {
  const [roleEdit, setRoleEdit] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  return (
    <div className='flex flex-col gap-4 overflow-scroll'>
      <div className='secondary-surface flex flex-1 flex-col gap-4 overflow-scroll rounded border p-4'>
        <p className='text-sm'>Manage your workspace security settings</p>
      </div>
      <div className='flex w-full flex-col gap-4 pb-10 pt-5'>
        <div className='flex w-full  justify-between gap-4 '>
          <h2 className='text-lg  font-semibold'>Roles</h2>
          <Button
            className='btn-primary'
            onClick={() => {
              setRoleEdit((prev) => !prev);
              setSelectedRole(null);
            }}
          >
            {roleEdit ? 'Cancel' : 'Add Role'}
          </Button>
        </div>
        <div className='secondary-surface flex flex-col gap-4 rounded border p-4'>
          <p className='text-sm'>
            You can add or adjust roles. Owner, admin, member roles are
            read-only
          </p>
        </div>

        {roleEdit ? <NewModifyRole role={selectedRole} /> : <ViewRoles />}
      </div>
      <div></div>
    </div>
  );
}

function ViewRoles() {
  const { currentWorkspace, changeWorkspace } = useContext(OrbitContext);
  const userSession = useContext(UserSessionContext);
  const [roles, setRoles] = useState([]);

  async function getRoles() {
    const res = await fetch(`/api/v2/workspaces/${currentWorkspace.id}/roles`, {
      headers: {
        Authorization: `Bearer ${userSession.access_token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      console.log(data);
      setRoles(data);
    }
  }

  useEffect(() => {
    getRoles();
  }, [currentWorkspace]);

  return (
    <div className='flex flex-col gap-2  rounded-md border text-sm  '>
      <div className='secondary-surface flex items-center  gap-4 border-b p-2  '>
        <span className='h-full w-24 flex-shrink-0'>Name</span>
        <span className='line-clamp-1 w-80 flex-shrink-0'>Description</span>
        <span className='flex flex-wrap gap-2'>Permissions</span>
      </div>
      {roles.map((role) => (
        <div key={role.name} className='flex items-center  gap-4 border-b p-2 '>
          <span className='h-full w-24 flex-shrink-0'>{role.name}</span>
          <span className='line-clamp-1 w-80 flex-shrink-0 truncate '>
            {role.description}
          </span>
          <div className='flex flex-wrap gap-2'>
            {role.permissions.map((permission) => (
              <div
                key={permission.permission}
                className='flex gap-1 rounded-sm border p-1'
              >
                <p>
                  {permission.entity}:{permission.permission}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function NewModifyRole(role) {
  const [perms, setPerms] = useState([]);

  async function getAvailablePermissions() {
    const res = await fetch(`/api/v2/resources/permissions`, {});

    if (res.ok) {
      const data = await res.json();
      setPerms(data);
    }
  }

  useEffect(() => {
    getAvailablePermissions();
  }, []);

  return (
    <div className='flex flex-col gap-2  overflow-scroll rounded-md border text-sm '>
      <form className='primary-surface flex flex-col   gap-4 overflow-scroll border-b p-2 py-4  '>
        <div className='flex gap-4'>
          <span className='h-full w-24 flex-shrink-0'>Name</span>
          <Input className='w-80' placeholder='Role Name' />
        </div>
        <div className='flex gap-4'>
          <span className='line-clamp-1 w-24 flex-shrink-0'>Description</span>
          <Input className='w-80' placeholder='Role Description' />
        </div>
        <div className='flex flex-col gap-4'>
          <span className='flex flex-wrap gap-2'>Permissions</span>
          <div className='flex flex-wrap gap-4'>
            {perms.map((perm) => (
              <div
                key={perm.entity}
                className='secondary-surface flex w-48 items-center gap-3 rounded border p-1 text-sm'
              >
                <input type='checkbox' />
                <p>
                  {perm.entity}:{perm.permission}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className='flex justify-end'>
          <Button className='btn-primary'>Save</Button>
        </div>
      </form>
    </div>
  );
}
