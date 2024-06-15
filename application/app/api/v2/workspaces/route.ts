import { DatabaseUtils } from '@/database/src/helpers/workspace';
import { db } from '@/lib/db/handler';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  if (!body.workspaceId) {
    return NextResponse.json(
      {
        error: 'Workspace ID is required',
      },
      {
        status: 400,
      }
    );
  }

  try {
    const user = JSON.parse(request.headers.get('user')!);

    const workspace = await db
      .selectFrom('public.workspace')
      .selectAll()
      .where('name', '=', body.workspaceId)
      .executeTakeFirst();
    if (workspace) {
      return NextResponse.json(
        {
          error: 'Workspace already exists',
        },
        {
          status: 400,
        }
      );
    }

    const id = await DatabaseUtils.setupWorkspace(db, {
      name: body.workspaceId,
      config: {},
      ownerId: user.id,
    });
    return NextResponse.json(id);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: 'Could not create workspace',
      },
      {
        status: 400,
      }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const workspaces = await db.selectFrom('public.workspace').selectAll().execute();
  return NextResponse.json(workspaces);
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
  try {
    const body = await request.json();
    const workspace = await db
      .selectFrom('public.workspace')
      .selectAll()
      .where('id', '=', params.wid)
      .executeTakeFirstOrThrow();
    const updatedWorkspace = await db
      .updateTable('public.workspace')
      .set({
        name: body.name,
        config: body.config,
      })
      .where('id', '=', workspace.id)
      .execute();
    return NextResponse.json(updatedWorkspace);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Could not update workspace',
      },
      {
        status: 400,
      }
    );
  }
}
