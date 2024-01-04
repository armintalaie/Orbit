import { db } from '@/lib/db/handler';

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
