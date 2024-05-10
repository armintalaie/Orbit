import { db } from '@/lib/db/handler';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const perms = await db
      .selectFrom('public.workspacePermission')
      .selectAll()
      .execute();

    return NextResponse.json(perms);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Could not fetch permissions' },
      { status: 500 }
    );
  }
}
