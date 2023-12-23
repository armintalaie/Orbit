import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const teamSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export async function POST(req: Request) {
  try {
    const newTeam = await req.json();
    const team = teamSchema.parse(newTeam);
    const { data } = await supabase.from('team').insert(team);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.member }, { status: 405 });
  }
}

export async function GET(req: NextRequest) {
  let searchParams = JSON.parse(req.nextUrl.searchParams.get('q') || '{}');
  let query = supabase.from('team_member').select(`teamid`);

  if (searchParams.length > 0) {
    if (searchParams.member) {
      query = query.eq('memberid', searchParams.member);
    }
  }
  let { data: teams } = await query;
  teams = teams || [];
  const teamIds = teams.map((team: any) => team.teamid);
  const data = await supabase.from('team').select().in('id', teamIds);
  return NextResponse.json(data.data);
}
