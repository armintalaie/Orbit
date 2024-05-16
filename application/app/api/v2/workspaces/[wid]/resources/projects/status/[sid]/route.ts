import { db } from '@/lib/db/handler';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1).max(255),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { wid: string; sid: string } }
): Promise<NextResponse> {
  const projects = await db
    .withSchema(`workspace_${params.wid}`)
    .selectFrom('project_status' as any)
    .where('id', '=', params.sid)
    .selectAll()
    .execute();
  return NextResponse.json(projects);
}

export async function Delete(
  request: NextRequest,
  { params }: { params: { wid: string; sid: string } }
): Promise<NextResponse> {
  try {
    await db
      .withSchema(`workspace_${params.wid}`)
      .deleteFrom('project_status' as any)
      .where('id', '=', params.sid)
      .execute();
    return NextResponse.json({ message: 'Project status deleted successfully' });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { wid: string; sid: string } }
): Promise<NextResponse> {
  const body = await request.json();
  try {
    schema.parse(body);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  await db
    .withSchema(`workspace_${params.wid}`)
    .updateTable('project_status' as any)
    .set(body)
    .where('id', '=', params.sid)
    .execute();
  return NextResponse.json({ message: 'Project status updated successfully' });
}
