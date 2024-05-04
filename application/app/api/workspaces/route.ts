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
  return NextResponse.json({ id });
}
