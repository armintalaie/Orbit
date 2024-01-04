import { db } from '@/lib/db/handler';
import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { pid: string } }
) {
  const authorization = headers().get('authorization');

  if (!authorization) {
    return NextResponse.json(
      { error: 'Not authenticated (missing header)' },
      { status: 401 }
    );
  }

  const { data: userData } = await supabase.auth.getUser(authorization);

  if (userData.user === null) {
    return NextResponse.json(
      { error: 'Could not authenticate' },
      { status: 401 }
    );
  }

  const body = await req.json();

  await db
    .updateTable('profiles')
    .set({
      updated_at: new Date().toISOString(),
      ...body,
    })
    .where('id', '=', userData.user.id)
    .execute();

  return NextResponse.json({ message: 'success' });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { pid: string } }
) {
  const authorization = headers().get('authorization');

  if (!authorization) {
    return NextResponse.json(
      { error: 'Not authenticated (missing header)' },
      { status: 401 }
    );
  }

  const { data: userData } = await supabase.auth.getUser(authorization);

  if (userData.user === null) {
    return NextResponse.json(
      { error: 'Could not authenticate' },
      { status: 401 }
    );
  }

  await db.deleteFrom('profiles').where('id', '=', userData.user.id).execute();
  return Response.json({ message: 'success' });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { pid: string } }
) {
  const authorization = headers().get('authorization');

  if (!authorization) {
    return NextResponse.json(
      { error: 'Not authenticated (missing header)' },
      { status: 401 }
    );
  }

  const { data: userData } = await supabase.auth.getUser(authorization);

  if (userData.user === null) {
    return NextResponse.json(
      { error: 'Could not authenticate' },
      { status: 401 }
    );
  }

  const profile = await db
    .selectFrom('profiles')
    .selectAll()
    .where('id', '=', userData.user.id)
    .execute();
  return Response.json(profile);
}
