import { db } from '@/lib/db/handler';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { wid: string } }
) {
  const body = await request.json();
  if (!body.userId) {
    return NextResponse.json({ error: 'user ID is required' }, { status: 403 });
  }

  try {
    const member = await db
      .insertInto('public.workspaceMember')
      .values({
        workspaceId: params.wid,
        userId: body.userId,
        username: body.username || body.userId,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    await AddUserToWorkspace(params.wid, body.userId, body.roles);
    return NextResponse.json(member);
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
  roles: any
) {
  try {
    const member = await db
      .withSchema(`workspace_${workspaceId}`)
      .insertInto('workspaceMember' as any)
      .values({
        memberId: userId,
        profile: {},
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return member;
  } catch (error) {
    console.error(error);
    return null;
  }
}
