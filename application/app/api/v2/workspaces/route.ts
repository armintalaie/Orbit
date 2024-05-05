import { DatabaseUtils } from '@/app/database/src/helpers/workspace';
import { db } from '@/lib/db/handler';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  if (!body.workspaceId) {
    return NextResponse.json(
      { error: 'Workspace ID is required' },
      { status: 400 }
    );
  }
  const id = await DatabaseUtils.setupWorkspace(db, {
    name: body.workspaceId,
    config: {},
    ownerId: 'e5f58d1d-204d-4775-a46a-db6327f6cc02',
  });
  return NextResponse.json(id);
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const workspaces = await db
    .selectFrom('public.workspace')
    .selectAll()
    .execute();
  return NextResponse.json(workspaces);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { wid: string } }
): Promise<NextResponse> {
  try {
    const body = await request.json();
    const workspace = await db
      .selectFrom('public.workspace')
      .selectAll()
      .where('id', '=', params.wid)
      .executeTakeFirstOrThrow();
    const updatedWorkspace = await db
      .updateTable('public.workspace')
      .set({
        name: body.name,
        config: body.config,
      })
      .where('id', '=', workspace.id)
      .execute();
    return NextResponse.json(updatedWorkspace);
  } catch (error) {
    return NextResponse.json(
      { error: 'Could not update workspace' },
      { status: 400 }
    );
  }
}
