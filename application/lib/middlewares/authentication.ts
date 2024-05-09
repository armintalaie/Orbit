import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../supabase';
// import { db } from '@/lib/db/handler';
import { updateSession } from '@/utils/supabase/middleware'


export default async function Authentication(
  setContext: (key: string, value: string) => void,
  req: NextRequest
): Promise<NextResponse> {
  const authorization = headers().get('authorization');


  if (!authorization) {
    return NextResponse.json(
      { error: 'Not authenticated (missing header)' },
      { status: 401 }
    );

  }
  

  console.log('authorization', authorization);
  const { data: userData , error} = await supabase.auth.getUser(authorization);

  if (error) {
    console.error(error.stack);

    return NextResponse.json(
      { error: 'Could not authenticate' },
      { status: 401 }
    );
  }

  if (userData.user === null) {
    return NextResponse.json(
    { error: 'Could not authenticate' },
      { status: 401 }
    );
  }

  let userRoles: any[] = [];
  if (req.nextUrl.pathname.startsWith('/api/v2/workspaces')) {
    let workspaceId = req.nextUrl.pathname.split('/')[3];
    if (!workspaceId) {
      return NextResponse.json(
        { error: 'Workspace ID is required' },
        { status: 400 }
      );
    }
    userRoles = await getUserRoles(userData.user.id, workspaceId);
  }

  
  const res = NextResponse.next();
  console.log('user', userData.user);
  console.log('roles', userRoles);
  try {
    setContext('user', JSON.stringify(userData.user));
    setContext('roles', JSON.stringify(userRoles));
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Could not authenticate' },
      { status: 401 }
    );
  }

  return res;
}



async function getUserRoles(userId: string, workspaceId: string) {
  const { data: roles, error } = await supabase
    .from(`workspace_${workspaceId}:workspaceMember`)
    .select(`
      workspaceMemberRole (
        *,
        role (
          *,
          rolePermission (
            *
          )
        )
      )
    `)
    .eq('memberId', userId);

  if (!roles) {
    return [];
  }

  return roles;

}
