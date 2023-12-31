import { db } from '@/lib/db/handler';

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

  return Response.json({ message: 'success' });
}
