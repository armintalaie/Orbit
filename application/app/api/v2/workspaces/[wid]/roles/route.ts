import { db } from '@/lib/db/handler';
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(
  request: NextRequest,
  { params }: { params: { wid: string } }
): Promise<NextResponse> {
  try {
    const workspace = await db
      .withSchema(`workspace_${params.wid}`)
      .selectFrom('role')
      .select((eb) => [
        'name',
        'role.description',
        jsonArrayFrom(
          eb
            .selectFrom('rolePermission')
            .whereRef('rolePermission.roleName', '=', 'role.name')
            .selectAll()
        ).as('permissions'),
      ])
      .execute();
    return NextResponse.json(workspace);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Workspace does not exist' },
      { status: 400 }
    );
  }
}
