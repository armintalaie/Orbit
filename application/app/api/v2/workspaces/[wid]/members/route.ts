import { db } from '@/lib/db/handler';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: NextRequest, { params }: { params: { wid: string } }) {
  const body = await request.json();
  const schema = z.object({
    email: z.string().email(),
  });

  try {
    schema.parse(body);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }

  try {
    const m = await db.transaction().execute(async (trx: any) => {
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

      await addUserToWorkspace(params.wid, body.email, userId, trx);
      return user;
    });

    return NextResponse.json({
      message: 'Member added successfully',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: 'Could not add member',
      },
      {
        status: 400,
      }
    );
  }
}

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      wid: string;
    };
  }
) {
  const schema = `workspace_${params.wid}.workspaceMember`;
  const members = await db
    .selectFrom('workspaceMember')
    .where('workspaceId', '=', params.wid)
    .innerJoin(
      `workspace_${params.wid}.workspaceMember` as any,
      `workspace_${params.wid}.workspaceMember.memberId`,
      'public.workspaceMember.userId'
    )
    .innerJoin('auth.users', 'auth.users.id', 'public.workspaceMember.userId')
    .where('public.workspaceMember.status', 'in', ['active', 'pending'])
    .select([
      'auth.users.id',
      'auth.users.email',
      'public.workspaceMember.status',
      `${schema}.firstName`,
      `${schema}.lastName`,
      `${schema}.username`,
      `${schema}.avatar`,
      `${schema}.location`,
      `${schema}.timezone`,
      `${schema}.pronouns`,
    ])

    .execute();

  return NextResponse.json(members);
}

async function addUserToWorkspace(workspaceId: string, email: string, userId: string, trx: any) {
  const roles = ['member'];
  const member = await trx
    .withSchema(`workspace_${workspaceId}`)
    .insertInto('workspaceMember' as any)
    .values({
      memberId: userId,
      username: email,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  await trx
    .withSchema(`workspace_${workspaceId}`)
    .insertInto('workspaceMemberRole')
    .values(
      roles.map((role: any) => ({
        memberId: userId,
        roleName: role,
      }))
    )
    .execute();
  return member;
}
