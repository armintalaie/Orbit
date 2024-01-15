import { db } from '@/lib/db/handler';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const label = await db.selectFrom('label').selectAll().execute();
  return NextResponse.json(label, {
    headers: {
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  });
}

