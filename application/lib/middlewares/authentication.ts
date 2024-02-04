import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../supabase';

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
  const { data: userData } = await supabase.auth.getUser(authorization);

  if (userData.user === null) {
    return NextResponse.json(
      { error: 'Could not authenticate' },
      { status: 401 }
    );
  }

  const res = NextResponse.next();
  try {
    setContext('user', JSON.stringify(userData.user));
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Could not authenticate' },
      { status: 401 }
    );
  }

  return res;
}
