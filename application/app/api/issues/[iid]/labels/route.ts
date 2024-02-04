import { publishEvent } from '@/app/api/sync';
import { db } from '@/lib/db/handler';
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import { headers } from 'next/headers';

export async function PATCH(
  req: Request,
  { params }: { params: { iid: string } }
) {
  const { iid } = params;

  const { labels } = await req.json();

  let insertLabels = db
    .insertInto('issue_label')
    .values(
      labels.map((label: string) => ({
        issueid: Number(iid),
        labelid: label,
      }))
    )
    .onConflict((oc) => oc.columns(['issueid', 'labelid']).doNothing())
    .execute();

  let deleteLabels = db
    .deleteFrom('issue_label')
    .where('issueid', '=', Number(iid))
    .where('labelid', 'not in', labels)
    .execute();

  await Promise.all([insertLabels, deleteLabels]);

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

      publishEvent(
        [ "project:" + updated.projectid, "team:" + updated.teamid, "issue:" + updated.id],
        updated,
     );

    return Response.json(updated);
  
}
