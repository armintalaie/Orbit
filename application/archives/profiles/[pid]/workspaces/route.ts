import { db } from '@/lib/db/handler';
import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

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
    .selectFrom('workspace_member')
    .innerJoin('workspace', 'workspace_member.workspace_id', 'workspace.id')
    .innerJoin('profiles', 'workspace_member.profile_id', 'profiles.id')
    .select(['workspace.id', 'workspace.name'])
    .where('profiles.id', '=', userData.user.id)
    .execute();
  return Response.json(profile);
}
