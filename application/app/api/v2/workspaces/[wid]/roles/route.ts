import { db } from '@/lib/db/handler';
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const schema = z.object({
  name: z.string(),
  description: z.string().optional(),
  permissions: z.array(z.string()),
});

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      wid: string;
    };
  }
): Promise<NextResponse> {
  try {
    const workspace = await db
      .withSchema(`workspace_${params.wid}`)
      .selectFrom('role')
      .select((eb) => [
        'name',
        'role.description',
        jsonArrayFrom(
          eb.selectFrom('rolePermission').whereRef('rolePermission.roleName', '=', 'role.name').selectAll()
        ).as('permissions'),
      ])
      .execute();
    return NextResponse.json(workspace);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: 'Workspace does not exist',
      },
      {
        status: 400,
      }
    );
  }
}

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      wid: string;
    };
    body: {
      name: string;
    };
  }
): Promise<NextResponse> {
  const role = await request.json();

  try {
    schema.parse(role);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Invalid input',
      },
      {
        status: 400,
      }
    );
  }

  try {
    const allowedPermissionsReq = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v2/resources/permissions`);
    const allowedPermissions = await allowedPermissionsReq.json();
    const allowedPermissionsNames = allowedPermissions.map(
      (permission: any) => `${permission.entity}:${permission.permission}`
    );

    const invalidPermissions = role.permissions.filter(
      (permission: string) => !allowedPermissionsNames.includes(permission)
    );
    if (invalidPermissions.length > 0) {
      return NextResponse.json(
        {
          error: 'Invalid permissions',
        },
        {
          status: 400,
        }
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
      return {
        entity,
        permission: perm,
        role: role.name,
      };
    });

    await db
      .withSchema(`workspace_${params.wid}`)
      .insertInto('rolePermission')
      .values(
        entityPerms.map((entityPerms: { entity: string; permission: string; role: string }) => ({
          roleName: entityPerms.role,
          permission: entityPerms.permission,
          entity: entityPerms.entity,
        }))
      )
      .execute();
    return NextResponse.json({
      message: 'Role created successfully',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: 'Could not create role',
      },
      {
        status: 500,
      }
    );
  }
}
