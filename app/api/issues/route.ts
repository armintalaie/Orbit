import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import { db } from '@/lib/db/handler';

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
  let query = db
    .selectFrom('issue')
    .leftJoin('issue_assignee', 'issue.id', 'issue_assignee.issue_id')
    .innerJoin('project', 'issue.projectid', 'project.id')
    .select(({ eb, fn }) => [
      'issue.id',
      'issue.title',
      'issue.contents',
      'issue.statusid',
      'issue.deadline',
      'issue.datestarted',
      'issue.projectid',
      'project.title as project_title',
      // jsonObjectFrom(
      //   'project.id',
      // ).as('project'),
      'project.teamid',
      // 'team.title as team_title',
      jsonArrayFrom(
        eb
          .selectFrom('issue_label')
          .innerJoin('label', 'issue_label.labelid', 'label.id')
          .select(['labelid', 'label', 'color'])
          .whereRef('issue_label.issueid', '=', 'issue.id')
      ).as('labels'),
      jsonArrayFrom(
        eb
          .selectFrom('issue_assignee')
          .innerJoin('profiles', 'issue_assignee.user_id', 'profiles.id')
          .selectAll()
          .whereRef('issue_assignee.issue_id', '=', 'issue.id')
      ).as('assignees'),
    ]);

  if (searchParams.assignees && searchParams.assignees.length > 0) {
    query = query.where('issue_assignee.user_id', 'in', searchParams.assignees);
  }

  if (searchParams.teams && searchParams.teams.length > 0) {
    query = query.where('project.teamid', 'in', searchParams.teams.map(Number));
  }

  // if (searchParams.labels && searchParams.labels.length > 0) {
  //   query = query.where('issue_label.labelid', 'in', searchParams.labels);
  // }

  if (searchParams.statuses && searchParams.statuses.length > 0) {
    query = query.where(
      'issue.statusid',
      'in',
      searchParams.statuses.map(Number)
    );
  }

  if (searchParams.projects && searchParams.projects.length > 0) {
    query = query.where(
      'issue.projectid',
      'in',
      searchParams.projects.map(Number)
    );
  }

  // if (searchParams.deadline) {

  //   query = query.where('issue.deadline', '>=', searchParams.deadline);
  // }

  const issues = await query.execute();
  return NextResponse.json(issues);
}
