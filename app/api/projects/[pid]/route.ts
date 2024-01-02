import { db } from '@/lib/db/handler';
import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// import { z } from 'zod';

// const projectSchema = z.object({
//   title: z.string(),
//   description: z.string(),
//   statusid: z.number(),
//   deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
// });

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

  const projects = await db
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
    .select(({ fn }) => [
      'project.id',
      'project.title',
      'project.description',
      'project.statusid',
      'project.deadline',
      'project.datecreated',
      'project.teamid',
    ])
    .execute();

  console.log(projects);
  return NextResponse.json(projects);
}

export async function DELETE(
  req: Request,
  { params }: { params: { pid: string } }
) {
  const { pid } = params;
  await supabase.from('project').delete().eq('id', Number(pid));
  return Response.json({ message: 'success' });
}

export async function PATCH(
  req: Request,
  { params }: { params: { pid: string } }
) {
  try {
    const { pid } = params;
    const newProject = await req.json();
    const project = newProject;
    const data = await supabase
      .from('project')
      .update({ ...project, dateupdated: new Date().toISOString() })
      .eq('id', Number(pid));
    return Response.json(data.data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: '' }, { status: 405 });
  }
}
