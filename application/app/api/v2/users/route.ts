import { db } from '@/lib/db/handler';
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const users = await db
      .selectFrom('auth.users')
      .select((eb) => [
        'id',
        'email',
        jsonArrayFrom(
          eb
            .selectFrom('public.workspaceMember')
            .innerJoin(
              'public.workspace',
              'public.workspaceMember.workspaceId',
              'public.workspace.id'
            )
            .whereRef('public.workspaceMember.userId', '=', 'auth.users.id')
            .select(() => [
              'workspaceId',
              'workspace.name',
              'public.workspaceMember.updatedAt',
              'public.workspaceMember.status',
            ])
        ).as('workspaces'),
      ])
      .execute();

    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Could not fetch users' },
      { status: 500 }
    );
  }
}
