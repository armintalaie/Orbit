'use client';
import { UserSessionContext } from '@/lib/context/AuthProvider';
import { useContext, useEffect, useMemo, useState } from 'react';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { PencilLineIcon, Trash2Icon } from 'lucide-react';
import { LockClosedIcon } from '@radix-ui/react-icons';

export default function WorkspaceSecuritySettings() {
  const [roleEdit, setRoleEdit] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    if (selectedRole) {
      setRoleEdit(true);
    } else {
      setRoleEdit(false);
    }
  }, [selectedRole]);

  return (
    <div className='flex flex-col gap-4 overflow-scroll'>
      <div className='secondary-surface flex flex-1 flex-col gap-4  rounded border p-4'>
        <p className='text-sm'>Manage your workspace security settings.</p>
        <p className='text-sm'>Note, currently role permissions are not enforced.</p>
      </div>
      <div className='flex w-full flex-col gap-4 pb-10 pt-5'>
        <div className='flex w-full  justify-between gap-4 '>
          <h2 className='text-lg  font-semibold'>Roles</h2>
          <Button
            className='btn-primary'
            onClick={() => {
              if (roleEdit) {
                setSelectedRole(null);
              }
              setRoleEdit((prev) => !prev);
            }}
          >
            {roleEdit ? 'Cancel' : 'Add Role'}
          </Button>
        </div>
        <div className='secondary-surface flex flex-col gap-4 rounded border p-4'>
          <p className='text-sm'>You can add or adjust roles. Owner, admin, member roles are read-only</p>
        </div>

        {roleEdit ? (
          <NewModifyRole role={selectedRole} setSelectedRole={setSelectedRole} />
        ) : (
          <ViewRoles setSelectedRole={setSelectedRole} />
        )}
      </div>
      <div></div>
    </div>
  );
}

function ViewRoles({ setSelectedRole }) {
  const readOnlyRoles = useMemo(() => ['owner', 'admin', 'member'], []);
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
          <span className='h-full w-24 flex-shrink-0 truncate'>{role.name}</span>
          <p className='line-clamp-1 h-full w-80 flex-shrink-0  truncate	 '>{role.description}</p>
          <div className='flex flex-1 flex-wrap gap-2'>
            {role.permissions.map((permission) => (
              <div key={permission.permission} className='flex gap-1 rounded-sm border p-1 pb-2'>
                <p>
                  {permission.entity}:{permission.permission}
                </p>
              </div>
            ))}
          </div>
          <Button
            className='h-full w-10 flex-shrink-0 truncate p-0'
            variant={'ghost'}
            onClick={() =>
              setSelectedRole({
                name: role.name,
                description: role.description,
                permissions: role.permissions.map((p) => `${p.entity}:${p.permission}`),
              })
            }
            disabled={readOnlyRoles.includes(role.name)}
          >
            {readOnlyRoles.includes(role.name) ? (
              <LockClosedIcon className='h-4 w-4' />
            ) : (
              <PencilLineIcon className='h-4 w-4' />
            )}
          </Button>
        </div>
      ))}
    </div>
  );
}

const schema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  permissions: z.array(z.string()),
});

function NewModifyRole({ role, setSelectedRole }) {
  const { currentWorkspace } = useContext(OrbitContext);
  const userSession = useContext(UserSessionContext);
  const [perms, setPerms] = useState([]);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: role?.name || '',
      description: role?.description || '',
      permissions: role?.permissions || [],
    },
  });

  function changeSelectedPermissions(toAdd: boolean, perm: string) {
    const currentPerms = form.getValues().permissions;
    if (toAdd) {
      const permSet = new Set(currentPerms);
      permSet.add(perm);
      form.setValue('permissions', Array.from(permSet));
    } else {
      form.setValue(
        'permissions',
        currentPerms.filter((p) => p !== perm)
      );
    }
  }

  async function getAvailablePermissions() {
    const res = await fetch(`/api/v2/resources/permissions`, {});

    if (res.ok) {
      const data = await res.json();
      setPerms(data);
    }
  }

  async function saveRole(values: z.infer<typeof schema>) {
    let res;
    if (role) {
      res = await fetch(`/api/v2/workspaces/${currentWorkspace.id}/roles/${role.name}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userSession.access_token}`,
        },
        body: JSON.stringify(values),
      });
    } else {
      res = await fetch(`/api/v2/workspaces/${currentWorkspace.id}/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userSession.access_token}`,
        },
        body: JSON.stringify(values),
      });
    }

    if (res.ok) {
      toast('Role saved successfully');
      setSelectedRole(null);
    } else {
      toast('Role save failed');
    }
  }

  async function deleteRole(role) {
    const res = await fetch(`/api/v2/workspaces/${currentWorkspace.id}/roles/${role.name}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userSession.access_token}`,
      },
    });

    if (res.ok) {
      toast('Role deleted successfully');
      setSelectedRole(null);
    } else {
      toast('Role delete failed');
    }
  }

  useEffect(() => {
    getAvailablePermissions();
  }, []);

  return (
    <div className='primary-surface flex flex-col gap-2  overflow-scroll rounded-md border p-4  text-sm'>
      <Form {...form}>
        <form className=' flex flex-col   gap-4 overflow-scroll pb-4  ' onSubmit={form.handleSubmit(saveRole)}>
          <FormField
            control={form.control}
            name={'name'}
            render={({ field }) => (
              <FormItem className='flex items-center gap-2'>
                <FormLabel className='w-32 flex-shrink-0 text-sm  font-semibold'>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={'description'}
            render={({ field }) => (
              <FormItem className='flex items-center gap-2'>
                <FormLabel className='w-32 flex-shrink-0  text-sm  font-semibold'>Description</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='optional' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex flex-col gap-4'>
            <span className='flex flex-wrap gap-2 font-semibold'>Permissions</span>
            <div className='flex flex-wrap gap-4'>
              {perms.map((perm) => (
                <div
                  key={`${perm.entity}:${perm.permission}`}
                  className='secondary-surface flex w-48 items-center gap-3 rounded border p-2 text-sm'
                >
                  <input
                    type='checkbox'
                    checked={form.watch().permissions.includes(`${perm.entity}:${perm.permission}`)}
                    onChange={(e) => changeSelectedPermissions(e.target.checked, `${perm.entity}:${perm.permission}`)}
                  />
                  <p>
                    {perm.entity}:{perm.permission}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className='flex justify-end gap-4'>
            {role && (
              <Button
                type='button'
                className=' flex-shrink-0 gap-2 truncate'
                variant={'destructive'}
                onClick={() => deleteRole(role)}
              >
                <Trash2Icon className='h-4 w-4' />
                Delete
              </Button>
            )}

            <Button type='submit' variant={'outline'} className='btn-primary'>
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
