import { supabase } from '@/lib/supabase';
import { db } from '@/lib/db/handler';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';

export async function GET(
  req: Request,
  { params }: { params: { iid: string } }
) {
  const { iid } = params;
  let issue = await db
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
          .selectFrom('issue_assignee')
          .innerJoin('profiles', 'issue_assignee.user_id', 'profiles.id')
          .selectAll()
          .whereRef('issue_assignee.issue_id', '=', 'issue.id')
      ).as('assignees'),
      jsonArrayFrom(
        eb
          .selectFrom('issue_label')
          .innerJoin('label', 'issue_label.labelid', 'label.id')
          .select(['labelid', 'label.label', 'color'])
          .whereRef('issue_label.issueid', '=', 'issue.id')
      ).as('labels'),
    ])
    .where('issue.id', '=', Number(iid))
    .executeTakeFirst();

  console.log(issue);

  // issue?.contents = JSON.parse(issue?.contents as string);
  return Response.json(issue);
}

export async function DELETE(
  req: Request,
  { params }: { params: { iid: string } }
) {
  const { iid } = params;
  await supabase.from('issue').delete().eq('id', iid);
  return Response.json({ message: 'success' });
}

export async function PATCH(
  req: Request,
  { params }: { params: { iid: string } }
) {
  try {
    const { iid } = params;
    const newIssue = await req.json();
    const issue = newIssue;
    const data = await supabase
      .from('issue')
      .update({ ...issue, dateupdated: new Date().toISOString() })
      .eq('id', Number(iid));
    return Response.json(data.data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: '' }, { status: 405 });
  }
}
