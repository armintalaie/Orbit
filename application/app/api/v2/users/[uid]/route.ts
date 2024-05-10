import { db } from '@/lib/db/handler';
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import { NextRequest, NextResponse } from 'next/server';

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
              'username',
              'public.workspaceMember.updatedAt',
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
