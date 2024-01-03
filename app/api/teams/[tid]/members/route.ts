import { db } from '@/lib/db/handler';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const issueSchema = z.object({
  title: z.string(),
  contents: z.string(),
  statusid: z.number(),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  datestarted: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  projectid: z.number(),
});

export async function POST(
  req: Request,
  { params }: { params: { pid: string } }
) {
  try {
    const newIssue = await req.json();
    const issue = issueSchema.parse({
      ...newIssue,
      projectid: Number(params.pid),
    });

    const { data, error } = await supabase.from('issue').insert(issue);
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
  const teamMembers = await db
    .selectFrom('profiles')
    .innerJoin('team_member', 'profiles.id', 'team_member.memberid')
    .selectAll()
    .where('teamid', '=', Number(params.tid))
    .execute();

  return NextResponse.json(teamMembers);
}
