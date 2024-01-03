import { db } from '@/lib/db/handler';
import { NextResponse } from 'next/server';

export async function GET() {
  const statuses = await db.selectFrom('status').selectAll().execute();
  return NextResponse.json(statuses);
}
