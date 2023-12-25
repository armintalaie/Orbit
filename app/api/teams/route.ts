import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { headers } from 'next/headers';

const teamSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const authorization = headers().get('authorization');

    if (!authorization) {
      return NextResponse.redirect(new URL('/', req.nextUrl).toString());
    }
    const { data: userData } = await supabase.auth.getUser(authorization);

    if (userData.user === null) {
      return NextResponse.redirect(new URL('/', req.nextUrl).toString());
    }
    const newTeam = await req.json();
    const team = teamSchema.parse(newTeam);
    const { data } = await supabase.from('team').insert(team).select();

    if (!data) {
      return NextResponse.json({ error: 'Team not created' }, { status: 400 });
    }
    await supabase.from('team_member').insert({
      teamid: data[0].id,
      memberid: userData.user.id,
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.member }, { status: 405 });
  }
}

export async function GET(req: NextRequest) {
  const authorization = headers().get('authorization');

  if (!authorization) {
    return NextResponse.redirect(new URL('/', req.nextUrl).toString());
  }
  const { data: userData } = await supabase.auth.getUser(authorization);

  if (userData.user === null) {
    return NextResponse.redirect(new URL('/', req.nextUrl).toString());
  }

  let query = supabase
    .from('team_member')
    .select(`teamid`)
    .eq('memberid', userData.user.id);
  let { data: teams } = await query;

  teams = teams || [];
  const teamIds = teams.map((team: any) => team.teamid);
  const data = await supabase.from('team').select().in('id', teamIds);
  return NextResponse.json(data.data);
}

// function verifyAccess(req: NextRequest, teamId: string) {
//   const { user } = req.credentials;
//   if (!user) {
//     return false;
//   }
//   const { roles } = user;
//   if (roles.includes('admin')) {
//     return true;
//   }
//   if (roles.includes('member')) {
//     return true;
//   }
//   return false;
// }
