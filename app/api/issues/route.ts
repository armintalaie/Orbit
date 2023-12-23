import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const issueSchema = z.object({
  title: z.string(),
  contents: z.object({
    body: z.string(),
  }),
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

export async function GET(req: NextRequest) {
  let searchParams = JSON.parse(req.nextUrl.searchParams.get('q') || '{}');
  let query = supabase.from('issue_assignee').select(`issue_id`);

  if (searchParams.length > 0 || true) {
    if (searchParams.assignee) {
      query = query.eq('user_id', '09134631-de90-46a4-b5ed-f0b7e9368a6c');
    }
  }
  let { data: issue_ids } = await query;
  issue_ids = issue_ids.map((issue: any) => issue.issue_id);
  console.log(issue_ids);
  const { data, error } = await supabase
    .from('issue')
    .select(
      `
      id, title, statusid, deadline, datestarted, projectid, datecreated, dateupdated,
      assignee: issue_assignee (
        dateassigned,
        profile: user_id ( * )
      )
    `
    )
    .in('id', issue_ids);
  return NextResponse.json(data);
}
