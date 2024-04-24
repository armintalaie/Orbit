import { db } from '@/lib/db/handler';
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import { headers } from 'next/headers';
import socket, { publishEvent } from '../../sync';

export async function GET(
  req: Request,
  { params }: { params: { iid: string } }
) {
  const { iid } = params;

  let issue = await db
    .selectFrom('issue')
    .leftJoin('issue_assignee', 'issue.id', 'issue_assignee.issue_id')
    .innerJoin('project', 'issue.projectid', 'project.id')
    .innerJoin('team', 'project.teamid', 'team.id')
    .select(({ eb, fn }) => [
      'issue.id',
      'issue.title',
      'issue.statusid',
      'issue.deadline',
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

  if (!issue) {
    return Response.json({ error: 'Issue not found' }, { status: 404 });
  }

  return Response.json(issue);
}

export async function DELETE(
  req: Request,
  { params }: { params: { iid: string } }
) {
  const { iid } = params;
  await db.deleteFrom('issue').where('id', '=', Number(iid)).execute();
  return Response.json({ message: 'success' });
}

export async function PATCH(
  req: Request,
  { params }: { params: { iid: string } }
) {
  const h = headers().get('X-Full-Object');

  try {
    const { iid } = params;
    const newIssue = await req.json();
    const issue = newIssue;
    await db
      .updateTable('issue')
      .set({ ...issue, dateupdated: new Date().toISOString() })
      .where('id', '=', Number(iid))
      .returning(['id'])
      .executeTakeFirst();

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

    const assigneeSubs = updated.assignees.map((a: any) => 'user:' + a.id);
    publishEvent(
      [
        'project:' + updated.projectid,
        'team:' + updated.teamid,
        'issue:' + updated.id,
        ...assigneeSubs,
      ],
      updated
    );

    return Response.json(updated);

    // return Response.json({ message: 'success' });
  } catch (error) {
    console.log(error);
    return Response.json({ error: '' }, { status: 405 });
  }
}
