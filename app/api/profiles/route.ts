import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/handler';

export async function GET(
  req: NextRequest,
  { params }: { params: { tid: string } }
) {
  const teamMembers = await db.selectFrom('profiles').selectAll().execute();

  return NextResponse.json(teamMembers);
}
