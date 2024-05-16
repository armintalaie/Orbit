import { db } from '@/lib/db/handler';

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      iid: string;
    };
  }
) {
  const { iid } = params;

  let issue = await db.selectFrom('issue').select(['contents']).where('issue.id', '=', Number(iid)).executeTakeFirst();

  if (!issue) {
    return Response.json(
      {
        error: 'Issue not found',
      },
      {
        status: 404,
      }
    );
  }

  return Response.json(issue);
}
