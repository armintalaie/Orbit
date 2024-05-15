import { db } from '@/lib/db/handler';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  pronouns: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  displayName: z.string().nullable().optional(),
  timezone: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
});

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
    schema.parse(body);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  try {
    const member = await db
      .selectFrom('public.workspaceMember')
      .selectAll()
      .where('workspaceId', '=', params.wid)
      .where('userId', '=', params.mid)
      .executeTakeFirstOrThrow();
    const updatedMember = await db
      .withSchema(`workspace_${params.wid}`)
      .updateTable('workspaceMember')
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where('memberId', '=', member.userId)
      .execute();
    return NextResponse.json({
      message: 'Member updated successfully',
    });
  } catch (error) {
    console.error(error);
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
