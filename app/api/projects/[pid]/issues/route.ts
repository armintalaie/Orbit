import { db } from '@/lib/db/handler';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';

const issueSchema = z.object({
  title: z.string(),
  contents: z.object({
    body: z.string(),
  }),
  statusid: z.any(),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  datestarted: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  projectid: z.any(),
  labels: z.array(z.any()),
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

    const { labels, ...issueWithoutLabels } = issue;

    const { data, error } = await supabase
      .from('issue')
      .insert(issueWithoutLabels)
      .select();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (newIssue.assignee) {
      const { data: assignee, error: assigneeError } = await supabase
        .from('issue_assignee')
        .insert([
          {
            issue_id: data[0].id,
            user_id: newIssue.assignee,
          },
        ]);
      if (assigneeError) {
        return NextResponse.json(
          { error: assigneeError.message },
          { status: 400 }
        );
      }
      data[0].assignee = assignee;
    }

    if (newIssue.labels) {
      const { data: labels, error: labelsError } = await supabase
        .from('issue_label')
        .insert(
          newIssue.labels.map((label: string) => ({
            issueid: data[0].id,
            labelid: label,
          }))
        )
        .select();
      if (labelsError) {
        return NextResponse.json(
          { error: labelsError.message },
          { status: 400 }
        );
      }
      // data[0].labels = labels;
    }
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: '' }, { status: 405 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { pid: string } }
) {
  const projectsWithOpenIssueCounts = await db
    .selectFrom('issue')
    .select(({ eb, fn }) => [
      'issue.id',
      'issue.title',
      'issue.contents',
      'issue.statusid',
      'issue.deadline',
      'issue.datestarted',
      'issue.projectid',
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
    ])
    .where('issue.projectid', '=', Number(params.pid))
    .execute();

  return NextResponse.json(projectsWithOpenIssueCounts);
}
