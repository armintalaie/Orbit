import { DatabaseUtils } from '@/app/database/src/helpers/workspace';
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
