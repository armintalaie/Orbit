import { db } from '@/lib/db/handler';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(
  request: NextRequest,
  { params }: { params: { wid: string } }
) {
  const body = await request.json();
  const schema = z.object({
    email: z.string().email(),
    roles: z.array(z.object({ id: z.string() })).optional(),
  });

  try {
    schema.parse(body);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }

  try {
    const m = await db.transaction().execute(async (trx: any) => {
      const rolesToVerify = body.roles || [];
      if (rolesToVerify.length > 0) {
        await verifyRolesExist(params.wid, rolesToVerify, trx);
      } else {
        rolesToVerify.push('member');
      }
      const { id: userId } = await trx
        .selectFrom('auth.users')
        .select('id')
        .where('email', '=', body.email)
        .executeTakeFirstOrThrow();
      const user = await trx
        .insertInto('public.workspaceMember')
        .values({
          workspaceId: params.wid,
          userId: userId,
          status: 'pending',
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      await AddUserToWorkspace(params.wid, userId, body.roles, trx);
      return user;
    });

    return NextResponse.json(m);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Could not add member' },
      { status: 400 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { wid: string } }
) {
  const members = await db
    .selectFrom('public.workspaceMember')
    .selectAll()
    .where('workspaceId', '=', params.wid)
    .execute();

  return NextResponse.json(members);
}

async function AddUserToWorkspace(
  workspaceId: string,
  userId: string,
  roles: any,
  trx: any
) {
  const member = await trx
    .withSchema(`workspace_${workspaceId}`)
    .insertInto('workspaceMember' as any)
    .values({
      memberId: userId,
      profile: {},
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  await trx
    .withSchema(`workspace_${workspaceId}`)
    .insertInto('workspaceMemberRole')
    .values(roles.map((role: any) => ({ memberId: member.id, roleName: role })))
    .execute();
  return member;
}

async function verifyRolesExist(workspaceId: string, roles: any, db: any) {
  const rolesInWorkspace = await db
    .withSchema(`workspace_${workspaceId}`)
    .selectFrom('role')
    .selectAll()
    .where('name', 'in', roles)
    .execute();
  return rolesInWorkspace.length === roles.length;
}
