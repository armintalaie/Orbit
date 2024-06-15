import { db } from '@/lib/db/handler';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1).max(255),
});

export async function GET(request: NextRequest, { params }: { params: { wid: string } }): Promise<NextResponse> {
  const projects = await db
    .withSchema(`workspace_${params.wid}`)
    .selectFrom('project_status' as any)
    .selectAll()
    .execute();
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest, { params }: { params: { wid: string } }): Promise<NextResponse> {
  const body = await request.json();
  try {
    schema.parse(body);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  const project = await db
    .withSchema(`workspace_${params.wid}`)
    .insertInto('project_status' as any)
    .values(body)
    .execute();
  return NextResponse.json(project);
}
