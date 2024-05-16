import { db } from '@/lib/db/handler';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  status: z.string(),
});

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      uid: string;
      wid: string;
    };
  }
): Promise<NextResponse> {
  const body = await request.json();
  try {
    schema.parse(body);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: (error as Error).message,
      },
      {
        status: 400,
      }
    );
  }

  const user = await db
    .updateTable('workspaceMember')
    .set({
      status: body.status,
    })
    .where('userId', '=', params.uid)
    .where('workspaceId', '=', params.wid)
    .returningAll()
    .executeTakeFirst();

  if (!user) {
    return NextResponse.json(
      {
        error: 'User does not exist',
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json({ message: 'User updated successfully' });
}
