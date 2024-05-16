import { DatabaseUtils } from '@/database/src/helpers/workspace';
import { db } from '@/lib/db/handler';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      wid: string;
    };
  }
): Promise<NextResponse> {
  console.log('params', params);
  const id = await DatabaseUtils.destroyWorkspace(db, params.wid);
  return NextResponse.json({ id });
}

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      wid: string;
    };
  }
): Promise<NextResponse> {
  try {
    const workspace = await db
      .selectFrom('public.workspace')
      .selectAll()
      .where('id', '=', params.wid)
      .executeTakeFirstOrThrow();
    return NextResponse.json(workspace);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Workspace does not exist',
      },
      {
        status: 400,
      }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      wid: string;
    };
  }
): Promise<NextResponse> {
  const body = await request.json();
  const schema = z.object({
    name: z
      .string()
      .min(3)
      .max(100)
      .regex(/^[a-zA-Z0-9 ]+$/, {
        message: 'Name can only contain letters, numbers, and spaces',
      }),
  });
  try {
    schema.parse(body);
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message,
      },
      {
        status: 400,
      }
    );
  }
  const workspace = await db
    .updateTable('public.workspace')
    .set({
      name: body.name,
    })
    .where('id', '=', params.wid)
    .returningAll()
    .executeTakeFirstOrThrow();
  return NextResponse.json(workspace);
}
