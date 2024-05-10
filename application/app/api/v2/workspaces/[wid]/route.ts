import { DatabaseUtils } from '@/database/src/helpers/workspace';
import { db } from '@/lib/db/handler';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { wid: string } }
): Promise<NextResponse> {
  console.log('params', params);
  const id = await DatabaseUtils.destroyWorkspace(db, params.wid);
  return NextResponse.json({ id });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { wid: string } }
): Promise<NextResponse> {
  try {
    const workspace = await db
      .selectFrom('public.workspace')
      .selectAll()
      .where('id', '=', params.wid)
      .executeTakeFirstOrThrow();
    return NextResponse.json(workspace);
  } catch (error) {
    return NextResponse.json(
      { error: 'Workspace does not exist' },
      { status: 400 }
    );
  }
}
