import { db } from '@/lib/db/handler';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const schema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

const defaultRoles = ['admin', 'member', 'owner'];

export async function PATCH(
  request: NextRequest,
  { params }: { params: { wid: string; rName: string }; body: any }
): Promise<NextResponse> {
  const role = await request.json();

  try {
    schema.parse(role);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  if (defaultRoles.includes(role.name)) {
    return NextResponse.json(
      { error: 'Cannot update default roles' },
      { status: 400 }
    );
  }

  try {
    const allowedPermissionsReq = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v2/resources/permissions`
    );
    const allowedPermissions = await allowedPermissionsReq.json();
    const allowedPermissionsNames = allowedPermissions.map(
      (permission: any) => `${permission.entity}:${permission.permission}`
    );

    const invalidPermissions = role.permissions.filter(
      (permission: string) => !allowedPermissionsNames.includes(permission)
    );
    if (invalidPermissions.length > 0) {
      return NextResponse.json(
        { error: 'Invalid permissions' },
        { status: 400 }
      );
    }

    await db
      .withSchema(`workspace_${params.wid}`)
      .insertInto('role')
      .values({
        name: role.name,
        description: role.description,
      })
      .execute();

    const entityPerms = role.permissions.map((permission: string) => {
      const [entity, perm] = permission.split(':');
      return { entity, permission: perm, role: role.name };
    });

    await db
      .withSchema(`workspace_${params.wid}`)
      .deleteFrom('rolePermission')
      .where('roleName', '=', role.name);

    if (role.name) {
      await db
        .withSchema(`workspace_${params.wid}`)
        .updateTable('role')
        .set({
          name: role.name,
        })
        .where('name', '=', role.name)
        .execute();
    }

    await db
      .withSchema(`workspace_${params.wid}`)
      .insertInto('rolePermission')
      .values(
        entityPerms.map(
          (entityPerms: {
            entity: string;
            permission: string;
            role: string;
          }) => ({
            roleName: entityPerms.role,
            permission: entityPerms.permission,
            entity: entityPerms.entity,
          })
        )
      )
      .execute();
    return NextResponse.json({ message: 'Role created successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Could not create role' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { wid: string; rName: string } }
): Promise<NextResponse> {
  if (defaultRoles.includes(params.rName)) {
    return NextResponse.json(
      { error: 'Cannot delete default roles' },
      { status: 400 }
    );
  }

  const role = await db
    .withSchema(`workspace_${params.wid}`)
    .deleteFrom('role')
    .where('name', '=', params.rName)
    .execute();
  return NextResponse.json({
    message: 'Role deleted successfully',
  });
}
