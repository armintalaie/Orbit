import { db } from '@/lib/db/handler';
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import { headers } from 'next/headers';

export async function DELETE(
  req: Request,
  { params }: { params: { iid: string } }
) {
  const { iid } = params;
  await db
    .deleteFrom('issue_assignee')
    .where('issue_id', '=', Number(iid))
    .execute();

  return Response.json({ message: 'success' });
}

export async function PATCH(
  req: Request,
  { params }: { params: { iid: string } }
) {
  const h = headers().get('X-Full-Object');
  try {
    const { iid } = params;

    await db
      .deleteFrom('issue_assignee')
      .where('issue_id', '=', Number(iid))
      .execute();
    const body = await req.json();
    if (!body.user_id) {
      return Response.json({ message: 'success' });
    }
    const user_id = body.user_id;
    await db
      .insertInto('issue_assignee')
      .values({
        user_id: user_id as string,
        issue_id: Number(iid) as number,
        dateassigned: new Date().toISOString(),
      })
      .onConflict((oc) => oc.columns(['user_id', 'issue_id']).doNothing())
      .execute();

    if (h === 'true') {
      const updated = await db
        .selectFrom('issue')
        .leftJoin('issue_assignee', 'issue.id', 'issue_assignee.issue_id')
        .innerJoin('project', 'issue.projectid', 'project.id')
        .innerJoin('team', 'project.teamid', 'team.id')
        .select(({ eb, fn }) => [
          'issue.id',
          'issue.title',
          'issue.contents',
          'issue.statusid',
          'issue.deadline',
          'issue.datestarted',
          'issue.projectid',
          'project.title as project_title',
          'project.teamid',
          'team.name as team_title',
          jsonArrayFrom(
            eb
              .selectFrom('issue_label')
              .innerJoin('label', 'issue_label.labelid', 'label.id')
              .select(['labelid as id', 'label', 'color'])
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
        .where('issue.id', '=', Number(iid))
        .executeTakeFirst();

      return Response.json(updated);
    }
    return Response.json({ message: 'success' });
  } catch (error) {
    console.log(error);
    return Response.json({ error: '' }, { status: 405 });
  }
}

export async function POST(req: any) {
  const data = await req.json();
  const query = await db
    .insertInto('issue_assignee')
    .values({
      user_id: data.user_id as string,
      issue_id: Number(data.issue_id) as number,
      dateassigned: new Date().toISOString(),
    })
    .executeTakeFirst();

  return Response.json(query.insertId);
}

export async function GET(req: any, { params }: { params: { iid: string } }) {
  const { iid } = params;
  const data = await db
    .selectFrom('issue_assignee')
    .selectAll()
    .where('issue_id', '=', Number(iid))
    .execute();
  return Response.json(data);
}
