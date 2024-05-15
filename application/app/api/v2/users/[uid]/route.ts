import { db } from '@/lib/db/handler';
import { sql } from 'kysely';
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } }
): Promise<NextResponse> {
  try {
    const user = await db
      .selectFrom('auth.users')
      .where('id', '=', params.uid)
      .select((eb) => [
        'id',
        'email',
        jsonArrayFrom(
          eb
            .selectFrom('public.workspaceMember')
            .where('user_id', '=', params.uid)
            .innerJoin('public.workspace', 'workspaceId', 'id')
            .select((eb) => [
              'workspaceId',
              'workspace.name',
              'public.workspaceMember.updatedAt',
              'public.workspaceMember.status',
            ])
        ).as('workspaces'),
      ])
      .executeTakeFirst();

    if (!user) {
      return NextResponse.json(
        { error: 'User does not exist' },
        { status: 404 }
      );
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Could not fetch user' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { uid: string } }
): Promise<NextResponse> {
  const body = await request.json();
  const schema = z.object({
    profile: z.object({
      firstName: z.string().min(1).max(100).optional().nullable(),
      lastName: z.string().min(1).max(100).optional().nullable(),
      pronouns: z.string().min(1).max(100).optional().nullable(),
      avatar: z.string().min(1).optional().nullable(),
    }),
  });

  try {
    schema.parse(body);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }

  const user = await db
    .updateTable('account')
    .set({ ...body.profile })
    .where('id', '=', params.uid)
    .returning('id')
    .executeTakeFirst();

  if (!user) {
    return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
  }

  return NextResponse.json(user);
}
