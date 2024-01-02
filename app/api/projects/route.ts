import { db } from '@/lib/db/handler';
import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  statusid: z.number(),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  datestarted: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function POST(req: Request) {
  try {
    const newProject = await req.json();
    const project = projectSchema.parse(newProject);

    const { data, error } = await supabase.from('project').insert(project);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: '' }, { status: 405 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { pid: string } }
) {
  const authorization = headers().get('authorization');

  if (!authorization) {
    return NextResponse.redirect(new URL('/', req.nextUrl).toString());
  }

  const { data: userData } = await supabase.auth.getUser(authorization);

  if (userData.user === null) {
    return NextResponse.redirect(new URL('/', req.nextUrl).toString());
  }

  let searchParams = JSON.parse(req.nextUrl.searchParams.get('q') || '{}');
  let query = db
    .selectFrom('project')
    .innerJoin(
      db
        .selectFrom('team_member')
        .select(['teamid'])
        .where('memberid', '=', userData.user.id)
        .as('teams'),
      'teams.teamid',
      'project.teamid'
    )
    .innerJoin('team', 'project.teamid', 'team.id')
    .select(({ eb, fn }) => [
      'project.id',
      'project.title',
      'project.description',
      'project.statusid',
      'project.deadline',
      'project.title as project_title',
      'project.teamid',
      'team.name as team_title',
    ]);

  if (searchParams.teams && searchParams.teams.length > 0) {
    query = query.where('project.teamid', 'in', searchParams.teams.map(Number));
  }

  const result = await query.execute();
  return NextResponse.json(result);
}
