import { db } from '@/lib/db/handler';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { wid: string; mid: string } }
): Promise<NextResponse> {
  const id = await db
    .deleteFrom('public.workspaceMember')
    .where('workspaceId', '=', params.wid)
    .where('userId', '=', params.mid)
    .execute();
  return NextResponse.json({ id });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { wid: string; mid: string } }
): Promise<NextResponse> {
  const body = await request.json();

  try {
    const member = await db
      .selectFrom('public.workspaceMember')
      .selectAll()
      .where('workspaceId', '=', params.wid)
      .where('userId', '=', params.mid)
      .executeTakeFirstOrThrow();
    const updatedMember = await db
      .updateTable('public.workspaceMember')
      .set({
        username: body.username,
        updatedAt: new Date(),
      })
      .where('workspaceId', '=', member.workspaceId)
      .where('userId', '=', member.userId)
      .execute();
    return NextResponse.json(updatedMember);
  } catch (error) {
    return NextResponse.json(
      { error: 'Could not update member' },
      { status: 400 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { wid: string; mid: string } }
): Promise<NextResponse> {
  try {
    const member = await db
      .selectFrom('public.workspaceMember')
      .selectAll()
      .where('workspaceId', '=', params.wid)
      .where('userId', '=', params.mid)
      .leftJoin(
        `workspace_${params.wid}.workspaceMember` as any,
        'public.workspaceMember.userId',
        `workspace_${params.wid}.workspaceMember.memberId`
      )
      .executeTakeFirstOrThrow();
    return NextResponse.json(member);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Could not get member' },
      { status: 400 }
    );
  }
}
