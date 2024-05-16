import { db } from '@/lib/db/handler';
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  startDate: z.date().nullable().optional(),
  targetDate: z.date().nullable().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { wid: string; pid: string } }
): Promise<NextResponse> {
  const projects = await db
    .withSchema(`workspace_${params.wid}`)
    .selectFrom('project' as any)
    .where('id', '=', params.pid)
    .select((eb) => [
      'datecreated',
      'description',
      'id',
      'name',
      'status',
      'startdate',
      'targetdate',
      'updatedAt',
      'createdAt',
      jsonArrayFrom(
        (eb as any)
          .selectFrom('project_member' as any)
          .innerJoin('workspaceMember', 'project_member.id', 'workspaceMember.memberId')
          .whereRef('project_member.projectId', '=', 'project.id')
          .selectAll()
          .as('members')
      ),
    ])
    .execute();
  return NextResponse.json(projects);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { wid: string; pid: string } }
): Promise<NextResponse> {
  const project = await db
    .withSchema(`workspace_${params.wid}`)
    .deleteFrom('project' as any)
    .where('id', '=', params.pid)
    .execute();
  return NextResponse.json(project);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { wid: string; pid: string } }
): Promise<NextResponse> {
  const body = await request.json();
  try {
    schema.parse(body);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  const project = await db
    .withSchema(`workspace_${params.wid}`)
    .updateTable('project' as any)
    .set(body)
    .where('id', '=', params.pid)
    .execute();
  return NextResponse.json(project);
}
