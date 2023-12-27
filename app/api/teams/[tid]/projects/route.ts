import { db } from '@/lib/db/handler';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  statusid: z.number(),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  datestarted: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  teamid: z.number(),
});

export async function POST(
  req: Request,
  { params }: { params: { tid: string } }
) {
  try {
    const newProject = await req.json();
    const project = projectSchema.parse({
      ...newProject,
      teamid: Number(params.tid),
    });

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
  req: Request,
  { params }: { params: { tid: string } }
) {
  const projectsWithOpenIssueCounts = await db
    .selectFrom('project')
    .leftJoin(
      db
        .selectFrom('issue')
        .select(['projectid', 'id'])
        .where('statusid', 'not in', [1, 5, 6, 8])
        .as('issue'),
      'issue.projectid',
      'project.id'
    )
    .select(({ fn }) => [
      'project.id',
      'project.title',
      'project.description',
      'project.statusid',
      'project.deadline',
      'project.datecreated',
      'project.teamid',

      fn.count<number>('issue.id').as('count'),
    ])
    .where('project.teamid', '=', Number(params.tid))
    .groupBy('project.id')
    .execute();

  return NextResponse.json(projectsWithOpenIssueCounts);
}
